import { Box, Stack, Typography, Button, Grid, Divider } from '@mui/material'
import { Tag } from '../Tag/Tag'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOffRounded'

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
      <Stack
        direction="row"
        flexWrap={'wrap'}
        justifyContent={'space-around'}
        rowGap={1}
        columnGap={4}
      >
        {selection && selection.length > 0 && (
          <Box minWidth={110}>
            <Divider variant="middle" sx={{ mx: 0 }}>
              <Typography variant="caption">Selected</Typography>
            </Divider>
            <Grid container spacing={2} justifyContent={'center'}>
              {selection.map((t) => (
                <Grid key={t.id}>
                  <Tag tag={t} onSelect={() => onClickSelected && onClickSelected(t)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {exclusion && exclusion.length > 0 && (
          <Box minWidth={110}>
            <Divider variant="middle" sx={{ mx: 0 }}>
              <Typography variant="caption">Excluded</Typography>
            </Divider>
            <Grid container spacing={2} justifyContent={'center'}>
              {exclusion?.map((t) => (
                <Grid key={t.id}>
                  <Tag tag={t} excluded onSelect={() => onClickExcluded && onClickExcluded(t)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {includedExclusions && includedExclusions.length > 0 && (
          <Box minWidth={110}>
            <Divider variant="middle" sx={{ mx: 0 }}>
              <Typography variant="caption">Included</Typography>
            </Divider>
            <Grid container spacing={2} justifyContent={'center'}>
              {includedExclusions?.map((t) => (
                <Grid key={t.id}>
                  <Tag
                    tag={t}
                    onSelect={() => onClickIncludedExclusion && onClickIncludedExclusion(t)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}
