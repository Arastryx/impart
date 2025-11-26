import { Box, Stack, Typography, Button, Grid, Divider } from '@mui/material'
import React from 'react'
import { Tag } from '../Tag/Tag'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOffRounded'

export interface TagSelectionProps {
  selection?: Impart.Tag[]
  exclusion?: Impart.Tag[]
  onDeselect?: (tag: Impart.Tag) => void
  onInclude?: (tag: Impart.Tag) => void
  onClear?: () => void
}

export function TagSelection({
  selection,
  exclusion,
  onClear,
  onDeselect,
  onInclude
}: TagSelectionProps) {
  return (
    <Stack pt={1} gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Active Tags</Typography>
        <Button startIcon={<FilterAltOffIcon />} size="small" onClick={onClear}>
          Clear all
        </Button>
      </Stack>
      {selection && selection.length > 0 && (
        <Grid container spacing={2}>
          {selection.map((t) => (
            <Grid key={t.id}>
              <Tag tag={t} onSelect={() => onDeselect && onDeselect(t)} />
            </Grid>
          ))}
        </Grid>
      )}
      {selection && selection.length > 0 && exclusion && exclusion.length > 0 && <Divider />}
      {exclusion && exclusion.length > 0 && (
        <Grid container spacing={2}>
          {exclusion?.map((t) => (
            <Grid key={t.id}>
              <Tag tag={t} excluded onSelect={() => onInclude && onInclude(t)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}
