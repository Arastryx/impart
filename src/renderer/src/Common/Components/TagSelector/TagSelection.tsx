import { Box, Stack, Typography, Button, Grid, Divider } from '@mui/material'
import React from 'react'
import { Tag } from '../Tag/Tag'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOffRounded'
import AddIcon from '@mui/icons-material/Add'

export interface TagSelectionProps {
  selection?: Impart.Tag[]
  exclusion?: Impart.Tag[]
  includedExclusions?: Impart.Tag[]
  onClickSelected?: (tag: Impart.Tag) => void
  onClickExcluded?: (tag: Impart.Tag) => void
  onClickIncludedExclusion?: (tag: Impart.Tag) => void
  onClear?: () => void
}

export function TagSelection({
  selection,
  exclusion,
  includedExclusions,
  onClear,
  onClickSelected,
  onClickExcluded,
  onClickIncludedExclusion
}: TagSelectionProps) {
  return (
    <Stack pt={1} gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Active Tags</Typography>
        <Button startIcon={<FilterAltOffIcon />} size="small" onClick={onClear}>
          Clear all
        </Button>
      </Stack>
      <Stack gap={1}>
        {selection && selection.length > 0 && (
          <>
            <Divider>Selected</Divider>
            <Grid container spacing={2}>
              {selection.map((t) => (
                <Grid key={t.id}>
                  <Tag tag={t} onSelect={() => onClickSelected && onClickSelected(t)} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
        {exclusion && exclusion.length > 0 && (
          <>
            <Divider>Excluded</Divider>
            <Grid container spacing={2}>
              {exclusion?.map((t) => (
                <Grid key={t.id}>
                  <Tag tag={t} excluded onSelect={() => onClickExcluded && onClickExcluded(t)} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
        {includedExclusions && includedExclusions.length > 0 && (
          <>
            <Divider>Included</Divider>
            <Grid container spacing={2}>
              {includedExclusions?.map((t) => (
                <Grid key={t.id}>
                  <Tag
                    tag={t}
                    onSelect={() => onClickIncludedExclusion && onClickIncludedExclusion(t)}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Stack>
    </Stack>
  )
}
