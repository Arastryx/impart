import { In } from 'typeorm'
import { Taggable } from '../database/entities/Taggable'
import { TaggableImage, isTaggableImage } from '../database/entities/TaggableImage'
import { isTaggableStack, TaggableStack } from '../database/entities/TaggableStack'
import { ImpartTask, TaskType } from '../task/impartTask'
import { taskQueue } from '../task/taskQueue'
import logger from 'electron-log'
import { TaggableFile } from '../database/entities/TaggableFile'

export namespace StackManager {
  export async function create(
    name: string,
    taggableIds: number[],
    coverId?: number,
    parentStackId?: number
  ) {
    const childTaggables = await Taggable.find({
      where: { id: In(taggableIds) }
    })
    const cover = childTaggables.find((t) => t.id === coverId)
    let parent: TaggableStack | undefined = undefined

    if (parentStackId) {
      parent = await TaggableStack.findOneByOrFail({ id: parentStackId })
    }

    const stack = TaggableStack.create({
      name,
      cover: cover && isTaggableImage(cover) ? cover : undefined,
      taggables: childTaggables,
      dateModified: new Date(Math.max(...childTaggables.map((t) => t.dateModified.getTime()))),
      parent,
      tags: findCommonTags(childTaggables)
    })

    logger.info(`Created a new "${name}" stack containing ${buildTaggableString(childTaggables)}`)

    await stack.save()
  }

  function findCommonTags(items: Taggable[]) {
    let tags = items[0].tags

    for (const item of items.slice(1)) {
      tags = tags.filter((t) => item.tags.some((it) => it.id === t.id))
    }

    return tags
  }

  export async function addToStack(
    taggableIds: number[],
    stackId: number,
    currentStackId?: number
  ) {
    const childTaggables = await Taggable.find({
      where: { id: In(taggableIds) }
    })

    await Promise.all(
      childTaggables.map(async (t) => {
        t.parentId = stackId
        await t.save()
      })
    )

    if (currentStackId) {
      const stack = await TaggableStack.findOneOrFail({
        where: { id: stackId },
        relations: { taggables: true }
      })

      await validateStackCover(stack)

      logger.info(`Added ${buildTaggableString(childTaggables)} to the "${stack.name}" stack`)
    } else {
      logger.info(`Moved ${buildTaggableString(childTaggables)} back to the root`)
    }
  }

  export async function rename(stackId: number, name: string) {
    const stack = await TaggableStack.findOneByOrFail({ id: stackId })
    const oldName = stack.name
    stack.name = name
    await stack.save()

    logger.info(`Renamed the "${oldName}" stack to "${name}"`)
  }

  export async function setCover(stackId: number, coverId: number) {
    const [stack, cover] = await Promise.all([
      TaggableStack.findOneOrFail({ where: { id: stackId }, relations: { taggables: true } }),
      TaggableImage.findOneByOrFail({ id: coverId })
    ])

    if (!stack.taggables?.some((t) => t.id === cover.id)) {
      throw new Error('The cover image needs to be a direct child of the stack')
    }

    stack.cover = cover
    await stack.save()

    logger.info(`Updated the cover of the "${stack.name}" stack`)
  }

  export async function moveTaggablesToHome(taggableIds: number[], currentStackId: number) {
    const stack = await TaggableStack.findOneOrFail({
      where: { id: currentStackId },
      relations: { taggables: true }
    })

    const removedTaggables = stack.taggables!.filter((t) => taggableIds.some((id) => t.id === id))

    //Remove all target taggables from this stack (which will send them to the home stack)
    stack.taggables = stack.taggables!.filter((t) => !taggableIds.some((id) => t.id === id))
    await stack.save()

    logger.info(`Moved ${buildTaggableString(removedTaggables)} to the back to the root`)

    await validateStackCover(stack)
  }

  function buildTaggableString(taggables: Taggable[]) {
    if (taggables.length == 1) {
      return `"${getTaggableName(taggables[0])}"`
    } else if (taggables.length <= 4) {
      return `${taggables.length} items (${taggables.map(getTaggableName).join(', ')})`
    } else if (taggables.length > 4) {
      return `${taggables.length} items`
    }

    return ''
  }

  function getTaggableName(taggable: Taggable) {
    return isTaggableStack(taggable)
      ? taggable.name
      : (taggable as TaggableImage | TaggableFile).fileIndex.fileName
  }

  async function validateStackCover(stack: TaggableStack) {
    if (!stack.taggables?.some((t) => t.id === stack.cover?.id)) {
      stack.cover = stack.taggables?.find(isTaggableImage) ?? null
      await stack.save()
    }
  }

  export async function removeAllEmptyStacks() {
    taskQueue.add(new RemoveEmptyStacksTask())
  }

  export async function removeStack(stackId: number) {
    const stack = await TaggableStack.findOneOrFail({
      where: { id: stackId },
      relations: { taggables: true }
    })

    await removeLoadedStack(stack)
  }

  async function removeLoadedStack(stack: TaggableStack) {
    if (stack.taggables == null) {
      throw new Error('The stack taggables were not loaded')
    }

    if (stack.parentId != null) {
      await Promise.all(
        stack.taggables.map(async (t) => {
          t.parentId = stack.parentId
          await t.save()
        })
      )
    }

    await stack.remove()

    logger.info(`Exploded the "${stack.name}" stack`)
  }

  //CURRENTLY UNUSED. Finds all stacks with 0 or 1 items and removes them
  class RemoveEmptyStacksTask extends ImpartTask<TaggableStack> {
    protected override TYPE: TaskType = 'stackRemoval'
    protected override DELAY: number = 8

    protected override async prepare(): Promise<void> {
      const ids = (
        await TaggableStack.createQueryBuilder('stack')
          .select('stack.id AS id')
          .leftJoinAndSelect('stack.taggables', 'taggables')
          .groupBy('stack.id')
          .having('COUNT(taggables.id) <= 1')
          .getRawMany<{ id: number }>()
      ).map((r) => r.id)

      this.targets = await TaggableStack.find({
        where: { id: In(ids) },
        relations: { taggables: true }
      })
    }
    protected override async performStep(item: TaggableStack): Promise<void> {
      await removeLoadedStack(item)
    }
  }
}
