import { dialog } from 'electron'
import { impartApp } from '..'
import { Directory } from '../database/entities/Directory'
import { Taggable } from '../database/entities/Taggable'
import { In } from 'typeorm'
import { Tag } from '../database/entities/Tag'
import { IndexingManager } from './indexingManager'
import { zap } from '../common/zap'
import { TaggingManager } from '../tagging/taggingManager'
import { readdir } from 'fs/promises'

interface DirectoryPayload {
  path: string
  recursive: boolean
  autoTags?: number[]
}

export namespace DirectoryManager {
  export async function getIndexedDirectories() {
    const query = Directory.createQueryBuilder('directories')

    const result = await query
      .loadRelationCountAndMap('directories.taggableCount', 'directories.taggables', 'taggables')
      .loadRelationIdAndMap('directories.autoTags', 'directories.autoTags')
      .orderBy('directories.path')
      .getMany()

    return result
  }

  export async function selectDirectory() {
    if (!impartApp.mainWindow) {
      throw new Error('Tried to open a file dialog without access to the window')
    }

    const result = await dialog.showOpenDialog(impartApp.mainWindow, {
      properties: ['openDirectory']
    })

    return result.canceled ? undefined : result.filePaths[0]
  }

  export async function updateDirectories(directoryPayloads: DirectoryPayload[]) {
    const directories = await Directory.find({ relations: { autoTags: true } })

    const zappedDirectories = zap(
      directories,
      directoryPayloads,
      (first, second) => first.path === second.path
    )

    for (const [directory, payload] of zappedDirectories) {
      if (!directory && payload) {
        await createDirectory(payload)
      } else if (directory && payload) {
        await updateDirectory(directory, payload)
      } else if (directory && !payload) {
        await directory.remove()
      }
    }
  }

  async function createDirectory(payload: DirectoryPayload) {
    const tags =
      (payload.autoTags?.length ?? 0) > 0 ? await Tag.findBy({ id: In(payload.autoTags!) }) : []

    const directory = Directory.create({
      path: payload.path,
      recursive: payload.recursive,
      autoTags: tags
    })

    await directory.save()
    await IndexingManager.indexFiles(directory)
  }

  async function updateDirectory(directory: Directory, payload: DirectoryPayload) {
    if (!directory.autoTags) {
      throw new Error('Auto tags were not loaded')
    }

    const currentTagIds = directory.autoTags.map((t) => t.id)
    const tagsChanged = currentTagIds.sort().join(',') !== payload.autoTags?.sort().join(',')

    if (tagsChanged) {
      const nextTags =
        payload.autoTags == null || payload.autoTags.length == 0
          ? []
          : await Tag.findBy({ id: In(payload.autoTags) })

      directory.autoTags = nextTags
    }

    const recursionChanged = directory.recursive != payload.recursive
    directory.recursive = payload.recursive

    if (tagsChanged || recursionChanged) {
      await directory.save()

      if (recursionChanged) {
        IndexingManager.indexFiles(directory)
      }

      if (tagsChanged) {
        TaggingManager.bulkTagDirectory(directory)
      }
    }
  }

  export async function calculateTotalIndexChanges(directoryPayloads: DirectoryPayload[]) {
    const directories = await Directory.find()
    const zappedDirectories = zap(
      directories,
      directoryPayloads,
      (first, second) => first.path === second.path
    )

    const directoryResults = await Promise.all(
      zappedDirectories.map(async ([directory, payload]) =>
        calculateIndexChange(directory, payload)
      )
    )

    return directoryResults.reduce((current, next) => ({
      additions: current.additions + next.additions,
      removals: current.removals + next.removals
    }))
  }

  async function calculateIndexChange(directory?: Directory, payload?: DirectoryPayload) {
    if (directory && !payload) {
      return {
        additions: 0,
        removals: await Taggable.countBy({ directory })
      }
    } else if (!directory && payload) {
      const dirents = await readdir(payload.path, {
        withFileTypes: true,
        recursive: payload.recursive
      })

      const files = dirents.filter((dirent) => dirent.isFile())

      return {
        additions: files.length,
        removals: 0
      }
    } else if (directory && payload) {
      if (directory.recursive === payload.recursive) {
        return { additions: 0, removals: 0 }
      }

      const [taggableCount, resultingSearch] = await Promise.all([
        Taggable.countBy({ directory }),
        readdir(payload.path, {
          withFileTypes: true,
          recursive: payload.recursive
        })
      ])

      const resultingLength = resultingSearch.filter((d) => !d.isDirectory()).length

      return {
        additions: Math.max(0, resultingLength - taggableCount),
        removals: Math.max(0, taggableCount - resultingLength)
      }
    }

    throw new Error('Found a completely empty zap item')
  }
}
