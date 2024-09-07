import { delay } from '../common/sleep'
import { Tag } from '../database/entities/Tag'
import { TagGroup } from '../database/entities/TagGroup'
import { Taggable } from '../database/entities/Taggable'
import { TaggableImage } from '../database/entities/TaggableImage'
import { In } from 'typeorm'

export class TagManager {
  public async getTagGroups() {
    const groups = await TagGroup.find({
      order: {
        groupOrder: 'ASC'
      }
    })

    return groups.map((g) => ({
      id: g.id,
      label: g.label,
      tags: g.tags.map((t) => ({ id: t.id, label: t.label, color: t.color }))
    }))
  }

  public async setFileTags(taggableId: number, tagIds: number[]) {
    const [file, tags] = await Promise.all([
      Taggable.findOneBy({ id: taggableId }),
      Tag.findBy({ id: In(tagIds) })
    ])

    if (!file) {
      throw new Error(`Could not find taggable with id ${taggableId}`)
    }

    file.tags = tags
    await file.save()
  }

  public async bulkTag(taggableIds: number[], tagIds: number[]) {
    await Promise.all(
      taggableIds.map((t, index) => delay(() => this.addTags(t, tagIds), index * 10))
    )
  }

  private async addTags(taggableId: number, tagIds: number[]) {
    const [taggable, tags] = await Promise.all([
      Taggable.findOne({ where: { id: taggableId }, relations: { tags: true } }),
      Tag.findBy({ id: In(tagIds) })
    ])

    if (!taggable) {
      throw new Error(`Could not find taggable with id ${taggableId}`)
    }

    let added = false

    tags.forEach((addedTag) => {
      if (!taggable.tags.some((existingTag) => existingTag.id === addedTag.id)) {
        added = true
        taggable.tags.push(addedTag)
      }
    })

    if (added) {
      await taggable.save()
    }
  }

  public async createGroup() {
    const maxOrder = await TagGroup.maximum('groupOrder', {})

    const group = TagGroup.create({
      groupOrder: (maxOrder ?? 0) + 1
    })
    await group.save()

    return group
  }

  public async editGroup(id: number, label?: string, defaultTagColor?: string) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })

    groupEntity.label = label
    groupEntity.defaultTagColor = defaultTagColor

    await groupEntity.save()

    return groupEntity
  }

  public async deleteGroup(id: number) {
    const groupEntity = await TagGroup.findOneByOrFail({ id })
    await groupEntity.remove()
  }

  public async createTag(groupId: number) {
    const maxOrder = await Tag.maximum('tagOrder', { group: { id: groupId } })

    const tag = Tag.create({
      tagOrder: (maxOrder ?? 0) + 1,
      group: { id: groupId }
    })

    await tag.save()

    return tag
  }

  public async editTag(tagId: number, label?: string, color?: string) {
    const tagEntity = await Tag.findOneByOrFail({ id: tagId })

    tagEntity.label = label
    tagEntity.color = color

    await tagEntity.save()

    return tagEntity
  }

  public async deleteTag(id: number) {
    const tagEntity = await Tag.findOneByOrFail({ id })
    await tagEntity.remove()
  }
}

export const tagManager = new TagManager()
