import { arrayMoveImmutable } from '../common/arrayMove'
import { Tag } from '../database/entities/Tag'
import { TagGroup } from '../database/entities/TagGroup'

export namespace TagManager {
  export async function getTagGroups() {
    const groups = await TagGroup.find({
      order: {
        groupOrder: 'ASC'
      }
    })

    return groups
  }

  export async function createGroup() {
    const maxOrder = await TagGroup.maximum('groupOrder', {})

    const group = TagGroup.create({
      groupOrder: (maxOrder ?? 0) + 1
    })
    await group.save()

    return group
  }

  export async function editGroup(id: number, label?: string, defaultTagColor?: string) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })

    groupEntity.label = label
    groupEntity.defaultTagColor = defaultTagColor

    await groupEntity.save()

    return groupEntity
  }

  export async function reorderGroups(moveId: number, beforeId: number | 'end') {
    const groups = await TagGroup.find({ order: { groupOrder: 'ASC' } })
    const targetIndex = groups.findIndex((g) => g.id === moveId)
    let beforeIndex = beforeId === 'end' ? -1 : groups.findIndex((g) => g.id === beforeId)

    if (targetIndex === beforeIndex || targetIndex === beforeIndex - 1) {
      return
    }

    //When moving a group up the list, the move function removes it and then re-adds it
    // to the list at the new spot, but the removal step actually brings all the items
    // one index back, resulting it in getting injected one ahead. To compensate for this,
    // if we're moving up the list, we subtract the target index
    if (targetIndex < beforeIndex) {
      beforeIndex--
    }

    if (targetIndex == -1) {
      throw new Error(`Could not find tag group with id ${moveId}`)
    }

    if (beforeId !== 'end' && beforeIndex === -1) {
      throw new Error(`Could not find tag group with id ${beforeId}`)
    }

    const updatedOrder = arrayMoveImmutable(groups, targetIndex, beforeIndex)

    await Promise.all(
      updatedOrder.map(async (group, index) => {
        group.groupOrder = index
        await group.save()
      })
    )
  }

  export async function deleteGroup(id: number) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })
    await groupEntity.remove()
    return true
  }

  export async function createTag(groupId: number) {
    const [maxOrder, tagGroup] = await Promise.all([
      Tag.maximum('tagOrder', { group: { id: groupId } }),
      TagGroup.findOneBy({ id: groupId })
    ])

    if (!tagGroup) {
      throw new Error(`Could not find tag group with id ${groupId}`)
    }

    const tag = Tag.create({
      tagOrder: (maxOrder ?? 0) + 1,
      color: tagGroup.defaultTagColor,
      group: tagGroup
    })

    await tag.save()

    return tag
  }

  interface TagModel {
    label?: string
    color?: string
    isNsfw: boolean
  }

  export async function editTag(tagId: number, { label, color, isNsfw }: TagModel) {
    const tagEntity = await Tag.findOneByOrFail({ id: tagId })

    tagEntity.label = label
    tagEntity.color = color
    tagEntity.isNsfw = isNsfw

    await tagEntity.save()

    return tagEntity
  }

  export async function reorderTags(
    moveId: number,
    toGroupId: number,
    beforeTagId: number | 'end'
  ) {
    const [tag, nextGroup] = await Promise.all([
      Tag.findOneOrFail({ where: { id: moveId }, relations: { group: true } }),
      TagGroup.findOneByOrFail({ id: toGroupId })
    ])

    const oldGroup = tag.group!

    await insertTagIntoGroup(tag, nextGroup, beforeTagId)

    if (oldGroup.id != nextGroup.id) {
      await rejigTagOrder(oldGroup.id)
    }
  }

  async function insertTagIntoGroup(tag: Tag, group: TagGroup, beforeId: number | 'end') {
    group.tags.sort((a, b) => a.tagOrder - b.tagOrder)

    const targetIndex = group.tags.findIndex((g) => g.id === tag.id)
    let beforeIndex = beforeId === 'end' ? -1 : group.tags.findIndex((g) => g.id === beforeId)

    let updatedOrder: Tag[]

    //If we found the target
    if (targetIndex !== -1) {
      if (targetIndex === beforeIndex || targetIndex === beforeIndex - 1) {
        return
      }

      //When moving a group up the list, the move function removes it and then re-adds it
      // to the list at the new spot, but the removal step actually brings all the items
      // one index back, resulting it in getting injected one ahead. To compensate for this,
      // if we're moving up the list, we subtract the target index
      if (targetIndex < beforeIndex) {
        beforeIndex--
      }

      if (beforeId !== 'end' && beforeIndex === -1) {
        throw new Error(`Could not find tag group with id ${beforeId}`)
      }

      updatedOrder = arrayMoveImmutable(group.tags, targetIndex, beforeIndex)
    } else if (beforeId === 'end') {
      updatedOrder = group.tags.slice()
      updatedOrder.push(tag)
    } else {
      updatedOrder = group.tags.slice()
      updatedOrder.splice(beforeIndex, 0, tag)
    }

    updatedOrder.forEach((t, index) => {
      t.tagOrder = index
    })

    group.tags = updatedOrder
    await group.save()
  }

  async function rejigTagOrder(groupId: number) {
    const group = await TagGroup.findOneByOrFail({ id: groupId })

    await Promise.all(
      group.tags
        .sort((a, b) => a.tagOrder - b.tagOrder)
        .map(async (tag, index) => {
          tag.tagOrder = index
          await tag.save()
        })
    )
  }

  export async function deleteTag(id: number) {
    const tagEntity = await Tag.findOneByOrFail({ id })
    await tagEntity.remove()
    return true
  }
}
