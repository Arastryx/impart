import { Stack, Typography, Grid } from '@mui/material'
import { Tag } from '../Tag/Tag'
import { useSetting } from '@renderer/Common/Contexts/SettingsProvider'
import { useMemo } from 'react'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'

export interface EditTagsProps {
  tags: Impart.Tag[]
  removeTag?: (t: Impart.Tag) => void
}

interface TagOrder {
  tag: Impart.Tag
  groupOrder: number
}

function findOrder(tag: Impart.Tag, groups?: Impart.TagGroup[]): TagOrder {
  if (!groups) {
    return {
      tag,
      groupOrder: 0
    }
  }

  return {
    tag,
    groupOrder: groups.find((g) => g.tags?.some((t) => t.id === tag.id))?.groupOrder ?? 0
  }
}

function compareTagOrder(first: TagOrder, second: TagOrder) {
  if (first.groupOrder != second.groupOrder) {
    return first.groupOrder - second.groupOrder
  }

  return first.tag.tagOrder - second.tag.tagOrder
}

export function EditTags({ tags, removeTag }: EditTagsProps) {
  const { setting: displayOrder } = useSetting('taggableTagOrder')
  const { groups } = useTagGroups()

  const orderedTags = useMemo(() => {
    switch (displayOrder) {
      case 'applied':
        return tags
      case 'alphabetical':
        return tags
          .slice()
          .sort((a, b) => (a.label ?? 'Unnamed Tag').localeCompare(b.label ?? 'Unnamed Tag'))
      case 'sideBar':
        return tags
          .slice()
          .map((t) => findOrder(t, groups))
          .sort((a, b) => compareTagOrder(a, b))
          .map((t) => t.tag)
    }
  }, [tags, displayOrder, groups])

  return (
    <Stack p={2} gap={2}>
      <Typography textAlign="center" variant="h6">
        Tags
      </Typography>
      {tags.length > 0 && (
        <Grid container maxWidth={360} spacing={1} justifyContent={'center'}>
          {orderedTags?.map((t) => (
            <Grid key={t.id}>
              <Tag tag={t} onSelect={() => removeTag && removeTag(t)} />
            </Grid>
          ))}
        </Grid>
      )}
      {tags.length == 0 && (
        <Typography color="text.secondary" textAlign="center" fontStyle="italic" variant="body2">
          Untagged
        </Typography>
      )}
    </Stack>
  )
}
