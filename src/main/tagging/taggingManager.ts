import { In } from 'typeorm'
import { Directory } from '../database/entities/Directory'
import { Tag } from '../database/entities/Tag'
import { Taggable } from '../database/entities/Taggable'
import { taskQueue } from '../task/taskQueue'
import { TaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile } from '../database/entities/TaggableFile'
import { ImpartTask, TaskType } from '../task/impartTask'
import logger from 'electron-log'
import { isTaggableStack } from '../database/entities/TaggableStack'

export namespace TaggingManager {
  export async function setFileTags(taggableId: number, tagIds: number[]) {
    const [file, tags] = await Promise.all([
      Taggable.findOneBy({ id: taggableId }),
      Tag.findBy({ id: In(tagIds) })
    ])

    if (!file) {
      throw new Error(`Could not find taggable with id ${taggableId}`)
    }

    const beforeTags = file.tags

    file.tags = tags
    await file.save()

    logTagChange(beforeTags, tags, file)
  }

  export async function bulkTag(taggableIds: number[], tagIds: number[]) {
    taskQueue.add(new BulkTagByIdTask(taggableIds, tagIds))
  }

  export async function bulkTagDirectory(directory: Directory, fileNames?: string[]) {
    taskQueue.add(new BulkTagDirectoryTask(directory.path, fileNames))
  }

  export async function addTags(taggableId: number, tagIds: number[]) {
    const [taggable, tags] = await Promise.all([
      Taggable.findOneByOrFail({ id: taggableId }),
      Tag.findBy({ id: In(tagIds) })
    ])

    await addTagsToTaggable(taggable, tags)
  }

  async function addTagsToTaggable(taggable: Taggable, tags: Tag[]) {
    const addedTags: Tag[] = []

    tags.forEach((addedTag) => {
      if (!taggable.tags.some((existingTag) => existingTag.id === addedTag.id)) {
        addedTags.push(addedTag)
        taggable.tags.push(addedTag)
      }
    })

    if (addedTags.length > 0) {
      await taggable.save()
      logTagChange([], addedTags, taggable)
    }
  }

  function logTagChange(before: Tag[], after: Tag[], taggable: Taggable) {
    const removedTags = before.filter((b) => !after.some((a) => a.id == b.id))
    const addedTags = after.filter((a) => !before.some((b) => a.id == b.id))

    const taggableName = isTaggableStack(taggable)
      ? taggable.name
      : (taggable as TaggableFile | TaggableImage).fileIndex.fileName

    if (removedTags.length > 0) {
      if (addedTags.length > 0) {
        logger.info(
          `Removed ${tagArrayToString(removedTags)} and added ${tagArrayToString(addedTags)} to ${taggableName}`
        )
      } else {
        logger.info(`Removed ${tagArrayToString(removedTags)} from ${taggableName}`)
      }
    } else if (addedTags.length > 0) {
      logger.info(`Added ${tagArrayToString(addedTags)} to ${taggableName}`)
    }
  }

  function tagArrayToString(tags: Tag[]) {
    return tags.length == 1
      ? `"${tags[0].label ?? 'Unnamed'}"`
      : `${tags.length} tags (${tags.map((t) => t.label ?? 'Unnamed Tag').join(', ')})`
  }

  abstract class BaseBulkTagTask extends ImpartTask<Taggable> {
    protected readonly TYPE: TaskType = 'bulkTag'
    protected readonly DELAY: number = 10

    private tags?: Tag[]

    protected abstract getTaggables(): Promise<Taggable[]>
    protected abstract getTags(): Promise<Tag[]>

    public async prepare(): Promise<void> {
      ;[this.targets, this.tags] = await Promise.all([this.getTaggables(), this.getTags()])
    }

    protected async performStep(item: Taggable): Promise<void> {
      if (!this.tags) {
        throw new Error('Tried to bulk tag taggables before they were loaded')
      }

      await addTagsToTaggable(item, this.tags)
    }
  }

  class BulkTagByIdTask extends BaseBulkTagTask {
    private taggableIds: number[]
    private tagIds: number[]

    public constructor(taggableIds: number[], tagIds: number[]) {
      super()

      this.taggableIds = taggableIds
      this.tagIds = tagIds
    }

    protected getTaggables(): Promise<Taggable[]> {
      return Taggable.findBy({ id: In(this.taggableIds) })
    }

    protected getTags(): Promise<Tag[]> {
      return Tag.findBy({ id: In(this.tagIds) })
    }
  }

  class BulkTagDirectoryTask extends BaseBulkTagTask {
    private path: string
    private fileNames?: string[]

    private directory?: Directory

    public constructor(directoryPath: string, fileNames?: string[]) {
      super()

      this.path = directoryPath
      this.fileNames = fileNames
    }

    public override async prepare(): Promise<void> {
      this.directory = await Directory.findOneOrFail({
        where: { path: this.path },
        relations: { autoTags: true }
      })
      await super.prepare()
    }

    protected async getTaggables(): Promise<Taggable[]> {
      if (!this.fileNames) {
        return await Taggable.findBy({ directory: this.directory })
      }

      const [images, files] = await Promise.all([
        TaggableImage.findBy({
          directory: this.directory,
          fileIndex: { fileName: In(this.fileNames) }
        }),
        TaggableFile.findBy({
          directory: this.directory,
          fileIndex: { fileName: In(this.fileNames) }
        })
      ])

      return [...images, ...files]
    }

    protected async getTags(): Promise<Tag[]> {
      if (!this.directory?.autoTags) {
        throw new Error("Tried to fetch a directory's auto tags before it was loaded")
      }

      return this.directory.autoTags
    }
  }
}
