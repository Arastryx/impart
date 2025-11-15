import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { TagSelector } from './Common/Components/TagSelector'
import { Tag } from './Common/Components/Tag/Tag'
import CheckIcon from '@mui/icons-material/CheckRounded'
import { Backable } from './Common/Components/Backable'
import { VirtualTaggableGrid } from './Common/Components/TaggableGrid'

export interface BulkTagProps {
  items: Impart.Taggable[]
  onFinish?: () => void
}

export function BulkTag({ items, onFinish }: BulkTagProps) {
  const [tagSelection, setTagSelection] = useState<Impart.Tag[]>([])

  const removeFromSelection = (tag: Impart.Tag) => {
    const copy = tagSelection.slice()
    copy.splice(
      copy.findIndex((c) => c.id === tag.id),
      1
    )
    setTagSelection(copy)
  }

  const save = async () => {
    await window.tagApi.bulkTag(
      items.map((i) => i.id),
      tagSelection.map((t) => t.id)
    )
    onFinish && onFinish()
  }

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1}>
          <Box textAlign="center">
            <Typography variant="h2">Bulk Tags</Typography>
            <Typography>
              Add tags to multiple items at once. Repeat tags will be ignored.
            </Typography>
          </Box>

          <Stack flex={1} justifyContent="center" alignItems="center" gap={2}>
            <Box width="100%" flex={1}>
              <VirtualTaggableGrid taggables={items} />
            </Box>
            <Grid container spacing={1} width="unset">
              {tagSelection.map((t) => (
                <Grid key={t.id}>
                  <Tag tag={t} onSelect={() => removeFromSelection(t)} />
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={save}>
              Save
            </Button>
          </Stack>
        </Stack>
        <Box width={500}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <TagSelector selection={tagSelection} onSelectionChange={setTagSelection} />
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Backable>
  )
}
