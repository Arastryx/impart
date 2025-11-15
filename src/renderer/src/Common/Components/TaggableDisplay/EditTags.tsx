import { Stack, Typography, Grid } from '@mui/material'
import { Tag } from '../Tag/Tag'

export interface EditTagsProps {
  tags: Impart.Tag[]
  removeTag?: (t: Impart.Tag) => void
}

export function EditTags({ tags, removeTag }: EditTagsProps) {
  return (
    <Stack p={2} gap={2}>
      <Typography textAlign="center" variant="h6">
        Tags
      </Typography>
      {tags.length > 0 && (
        <Grid container maxWidth={360} spacing={1} justifyContent={'center'}>
          {tags.map((t) => (
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
