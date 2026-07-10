import { shell } from 'electron'
import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile, isTaggableFile } from '../database/entities/TaggableFile'
import { Taggable } from '../database/entities/Taggable'
import { IsNull, Like } from 'typeorm'
import { Directory } from '../database/entities/Directory'
import { imageSizeFromFile } from 'image-size/fromFile'
import { taskQueue } from '../task/taskQueue'
import dayjs from 'dayjs'
import { ImpartTask, TaskType } from '../task/impartTask'
import { ThumbnailManager } from './thumbnailManager'
import { zap } from '../common/zap'
import { TaggingManager } from '../tagging/taggingManager'
import { store } from '../config'
import logger from 'electron-log'

export namespace IndexingManager {
  let isIndexing = false

  interface Indexable {
    taggable?: TaggableImage | TaggableFile
    fileName?: string
    date?: Date
  }

  export async function indexAll() {
    if (isIndexing) {
      logger.info('Indexing skipped: Indexing is already in progress')
      return
    }

    let fileChangesDetected = false

    try {
      isIndexing = true
      const directories = await Directory.find({ relations: { autoTags: true } })

      for (const directory of directories) {
        logger.info('Indexing:', directory.path)
        const changesDetected = await indexFiles(directory)

        if (changesDetected) {
          fileChangesDetected = true
        }
      }
    } finally {
      isIndexing = false
    }

    return fileChangesDetected
  }

  export async function indexFiles(directory: Directory) {
    if (!existsSync(directory.path)) {
      logger.info('Directory no longer exists! Removing...')
      await directory.remove()
      return true
    }

    const dirsep = process.platform === 'linux' ? '/' : '\\'
    const dirents = await readdir(directory.path, {
      withFileTypes: true,
      recursive: directory.recursive
    })
    const files = dirents
      .filter((dirent) => dirent.isFile())
      .map((dirent) =>
        (dirent.parentPath + dirsep + dirent.name).replace(directory.path + dirsep, '')
      )

    const indexedTaggables = await getAllIndexedFilesInDirectory(directory)

    const combined = await Promise.all(
      zap(files, indexedTaggables, (filePath, taggable) =>
        isSameFile({ dir: directory.path, name: filePath }, taggable.fileIndex.path)
      ).map(
        async ([fileName, taggable]) =>
          ({
            taggable,
            fileName,
            date: fileName && taggable ? (await stat(taggable.fileIndex.path)).mtime : undefined
          }) satisfies Indexable
      )
    )

    const indexables = combined.filter(
      ({ taggable, fileName, date }) =>
        (fileName && !taggable) ||
        (taggable && !fileName) ||
        (taggable && date && taggable.dateModified.getTime() != date.getTime())
    )

    if (indexables.length !== 0) {
      taskQueue.add(new IndexFilesTask(directory, indexables))

      const unindexedFiles = indexables.filter(({ taggable, fileName }) => fileName && !taggable)

      if (unindexedFiles.length > 0) {
        taskQueue.add(new SourceAssociationTask(directory))

        if ((directory.autoTags?.length ?? 0) > 0) {
          TaggingManager.bulkTagDirectory(
            directory,
            unindexedFiles.map(({ fileName }) => fileName!)
          )
        }
      }

      return true
    }

    return false
  }

  type FilePath = { dir: string; name: string } | string

  function isSameFile(first: FilePath, second: FilePath) {
    if (process.platform === 'linux') {
      const firstNormalized = typeof first === 'string' ? first : `${first.dir}/${first.name}`
      const secondNormalized = typeof second === 'string' ? second : `${second.dir}/${second.name}`

      return firstNormalized === secondNormalized
    } else {
      const firstNormalized = (
        typeof first === 'string' ? first : `${first.dir}\\${first.name}`
      ).replace('/', '\\')
      const secondNormalized = (
        typeof second === 'string' ? second : `${second.dir}\\${second.name}`
      ).replace('/', '\\')

      return firstNormalized === secondNormalized
    }
  }

  async function getAllIndexedFilesInDirectory(directory: Directory) {
    const [images, files] = await Promise.all([
      TaggableImage.find({ where: { directory }, relations: { thumbnail: true } }),
      TaggableFile.find({ where: { directory } })
    ])

    return [...images, ...files]
  }

  async function index(directory: Directory, item: Indexable) {
    if (item.fileName && !item.taggable) {
      await createIndex(directory, item.fileName)
    } else if (item.taggable && item.fileName && item.date) {
      await updateIndex(item.taggable, item.date)
    } else if (item.taggable && !item.fileName) {
      logger.info(`Removing indexed item: ${item.taggable.fileIndex.fileName}`)
      await item.taggable.remove()
    }
  }

  async function createIndex(directory: Directory, fileName: string) {
    const fullPath = `${directory.path}/${fileName}`

    const extension = path.extname(fullPath).toLocaleLowerCase()

    if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
      await indexImage(fullPath, directory)
    } else {
      await indexFile(fullPath, directory)
    }
  }

  async function indexImage(filePath: string, directory: Directory) {
    logger.info('Indexing Image: ', filePath)
    const [size, stats] = await Promise.all([
      await imageSizeFromFile(filePath),
      await stat(filePath)
    ])

    const indexedImage = TaggableImage.create({
      fileIndex: {
        path: filePath,
        fileName: path.basename(filePath)
      },
      directory,
      dimensions: { width: size.width, height: size.height },
      dateModified: stats.mtime
    })

    await indexedImage.save()
  }

  async function indexFile(filePath: string, directory: Directory) {
    logger.info('Indexing File: ', filePath)

    const indexedFile = TaggableFile.create({
      fileIndex: { path: filePath, fileName: path.basename(filePath) },
      directory,
      dateModified: (await stat(filePath)).mtime
    })

    await indexedFile.save()
  }

  async function updateIndex(item: TaggableImage | TaggableFile, date: Date) {
    if (isTaggableImage(item)) {
      await ThumbnailManager.regenerateThumbnail(item)
    }

    item.dateModified = date
    await item.save()
  }

  async function findAndAssociateSourceFile(image: TaggableImage) {
    const possibleSourceFiles = await TaggableFile.findBy({
      fileIndex: {
        fileName: Like(`${path.parse(image.fileIndex.path).name}.%`),
        path: Like(`${path.parse(image.fileIndex.path).dir}%`)
      }
    })

    if (possibleSourceFiles.length > 0) {
      //If multiple files have the same filename (but with different extensions),
      // we grab whichever one has the closest modification date to the image
      if (possibleSourceFiles.length > 1) {
        possibleSourceFiles.sort(
          (a, b) =>
            Math.abs(dayjs(a.dateModified).diff(image.dateModified)) -
            Math.abs(dayjs(b.dateModified).diff(image.dateModified))
        )
      }

      logger.info('Associating indexed image with: ', possibleSourceFiles[0].fileIndex.path)
      image.source = possibleSourceFiles[0]

      if (image.tags.length == 0 && store.get('applyTagsOnSourceAssociation')) {
        image.tags = possibleSourceFiles[0].tags
      }

      await image.save()
    }
  }

  export async function openFile(taggableId: number) {
    const target = await Taggable.findOneByOrFail({ id: taggableId })
    if (isTaggableFile(target) || isTaggableImage(target)) {
      await shell.openPath(target.fileIndex.path)
    }
  }

  export async function openFileLocation(taggableId: number) {
    const target = await Taggable.findOneByOrFail({ id: taggableId })

    if (isTaggableFile(target) || isTaggableImage(target)) {
      shell.showItemInFolder(target.fileIndex.path)
    }
  }

  class IndexFilesTask extends ImpartTask<Indexable> {
    protected TYPE: TaskType = 'indexing'
    protected DELAY: number = 18

    private directory: Directory

    public constructor(directory: Directory, indexables: Indexable[]) {
      super()
      this.directory = directory
      this.targets = indexables
    }

    public async prepare(): Promise<void> {}

    protected performStep(item: Indexable): Promise<void> {
      return index(this.directory, item)
    }
  }

  class SourceAssociationTask extends ImpartTask<TaggableImage> {
    protected TYPE: TaskType = 'sourceAssociation'
    protected DELAY: number = 10

    private directory: Directory

    public constructor(directory: Directory) {
      super()
      this.directory = directory
    }

    public async prepare(): Promise<void> {
      this.targets = await TaggableImage.findBy({ source: IsNull(), directory: this.directory })
    }

    protected performStep(item: TaggableImage): Promise<void> {
      return findAndAssociateSourceFile(item)
    }
  }
}

