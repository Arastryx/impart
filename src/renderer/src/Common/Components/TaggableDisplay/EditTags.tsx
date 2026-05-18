import { Stack, Typography, Grid } from '@mui/material'
import { Tag } from '../Tag/Tag'
import { useSetting } from '@renderer/Common/Contexts/SettingsProvider'
import { useMemo } from 'react'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'

export interface EditTagsProps {
  tags: Impart.Tag[]
  removeTag?: (t: Impart.Tag) => void
}

function compareTagOrder(first: Impart.Tag, second: Impart.Tag, groups?: Impart.TagGroup[]) {
  if (!groups) {
    return 0
  }

  const firstGroup = groups.find((g) => g.tags?.some((t) => t.id === first.id))
  const secondGroup = groups.find((g) => g.tags?.some((t) => t.id === second.id))

  if (firstGroup?.id != secondGroup?.id) {
    return (firstGroup?.groupOrder ?? 0) - (secondGroup?.groupOrder ?? 0)
  }

  return first.tagOrder - second.tagOrder
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
        return tags.slice().sort((a, b) => compareTagOrder(a, b, groups))
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
