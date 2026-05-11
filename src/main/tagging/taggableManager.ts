import { In, SelectQueryBuilder } from 'typeorm'
import { Taggable } from '../database/entities/Taggable'
import { TaggableImage } from '../database/entities/TaggableImage'
import { TaggableFile } from '../database/entities/TaggableFile'
import { store } from '../config'

type SourceFileFilter = 'only' | 'all' | 'unassociated' | 'onlyUnassociated' | 'none'

export interface FetchTaggablesOptions {
  tagIds?: number[]
  excludedTagIds?: number[]
  order?: 'alpha' | 'date'
  search?: string
  year?: number
  directories?: string[]
  stackId?: number
  onlyHidden?: boolean
  allowPrivate?: boolean
  sourceFiles?: SourceFileFilter
}

export namespace TaggableManager {
  export async function getTaggables(options?: FetchTaggablesOptions) {
    let query = (
      options?.sourceFiles == 'only' || options?.sourceFiles == 'onlyUnassociated'
        ? TaggableFile
        : options?.sourceFiles == 'none'
          ? TaggableImage
          : Taggable
    )
      .createQueryBuilder('files')
      .setFindOptions({
        loadEagerRelations: true
      })

    if (options?.tagIds && options.tagIds.length > 0) {
      applyTags(query, options.tagIds)
    }

    if (options?.excludedTagIds && options.excludedTagIds.length > 0) {
      applyExcludedTags(query, options.excludedTagIds)
    }

    if (options?.order) {
      applyOrder(query, options.order)
    }

    if (options?.search && options.search != '') {
      applySearch(query, options.search)
    }

    if (options?.year) {
      query.andWhere("strftime('%Y', files.dateModified) = :year", {
        year: options.year.toString()
      })
    }

    if (options?.directories && options.directories.length > 0) {
      query.andWhere('files.directory IN (:...directories)', { directories: options.directories })
    }

    if (!options?.allowPrivate) {
      query.andWhere(
        `files.id NOT IN (SELECT taggable.id
            FROM taggable
            INNER JOIN taggable_tags_tag AS relation ON taggable.id = relation.taggableId
            INNER JOIN tag ON relation.tagId = tag.id AND tag.isPrivate = 1)`
      )
    }

    if (
      options?.sourceFiles == null ||
      options.sourceFiles == 'unassociated' ||
      options.sourceFiles == 'onlyUnassociated'
    ) {
      query.leftJoin('files.images', 'associatedImages').andWhere('associatedImages.id IS NULL')
    }

    query.andWhere('files.hide = :hidden', {
      hidden: options?.onlyHidden ? true : false
    })

    if (!options?.stackId) {
      query.andWhere('files.parentId IS NULL')
    } else {
      query.andWhere('files.parentId = :stackId', { stackId: options.stackId })
    }

    const result = await query.getMany()

    return result
  }

  function applyTags(query: SelectQueryBuilder<Taggable>, tagIds: number[]) {
    Array.from(tagIds).forEach((t, index) => {
      const alias = `tags${index}`
      const variable = `id${index}`
      query.innerJoin('files.tags', alias, `${alias}.id = :${variable}`, {
        [variable]: t
      })
    })
  }

  function applyExcludedTags(query: SelectQueryBuilder<Taggable>, excludedTagIds: number[]) {
    Array.from(excludedTagIds).forEach((t, index) => {
      const variable = `exclude${index}`

      query.andWhere(
        `files.id NOT IN (SELECT DISTINCT taggable.id
        FROM taggable
        INNER JOIN taggable_tags_tag AS tagRelation on taggable.id = tagRelation.taggableId
        INNER JOIN tag on tagRelation.tagId = tag.id AND tag.id = :${variable})`,
        { [variable]: t }
      )
    })
  }

  function applyOrder(query: SelectQueryBuilder<Taggable>, order: 'alpha' | 'date') {
    switch (order) {
      case 'alpha':
        query.orderBy('COALESCE(files.fileIndex.fileName, files.name) COLLATE NOCASE')
        break
      case 'date':
        query.orderBy('files.dateModified', 'DESC')
        break
    }
  }

  function applySearch(query: SelectQueryBuilder<Taggable>, search: string) {
    const terms = search.split(' ')

    terms.forEach((t, index) => {
      query.andWhere(
        `(files.fileIndex.fileName LIKE :term${index} OR files.name LIKE :term${index})`,
        { [`term${index}`]: `%${t}%` }
      )
    })
  }

  export async function getAllTaggableYears() {
    const query = Taggable.createQueryBuilder()
      .select("strftime('%Y', dateModified) AS taggableYear")
      .groupBy('taggableYear')

    const result = await query.getRawMany<{ taggableYear: string }>()

    return result.map((r) => Number(r.taggableYear)).reverse()
  }

  export async function setHidden(ids: number[], hidden: boolean) {
    const taggables = await Taggable.findBy({ id: In(ids) })

    await Promise.all(
      taggables.map(async (t) => {
        t.hide = hidden
        await t.save()
      })
    )
  }

  export async function associateImageWithFile(imageIds: number[], fileId: number) {
    const [images, file] = await Promise.all([
      TaggableImage.findBy({ id: In(imageIds) }),
      TaggableFile.findOneByOrFail({ id: fileId })
    ])

    await Promise.all(
      images.map(async (i) => {
        i.source = file

        if (i.tags.length == 0 && store.get('applyTagsOnSourceAssociation')) {
          i.tags = file.tags
        }

        await i.save()
      })
    )
  }

  export async function detachSourceFile(imageIds: number[]) {
    const images = await TaggableImage.findBy({ id: In(imageIds) })

    await Promise.all(
      images.map(async (i) => {
        i.source = null
        await i.save()
      })
    )
  }
}

