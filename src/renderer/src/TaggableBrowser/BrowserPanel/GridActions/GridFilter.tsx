import { Stack, IconButton, Chip, Popover } from '@mui/material'
import { YearSelector } from './YearSelector'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import FilterIcon from '@mui/icons-material/FilterAltRounded'
import { useState } from 'react'
import { DirectorySelector } from './DirectorySelector'
import { SourceVisibilitySelector } from './SourceVisibilitySelector'

export interface GridFilterProps {
  anchorEl: HTMLDivElement | null
}

export function GridFilter({ anchorEl }: GridFilterProps) {
  const [showFilters, setShowFilters] = useState(false)
  const {
    fetchOptions: { year, directories },
    setFetchOptions
  } = useTaggables()

  return (
    <>
      {year && (
        <Chip label={year} size="small" onDelete={() => setFetchOptions({ year: undefined })} />
      )}
      {directories && directories.length > 0 && (
        <Chip
          label={directories.length === 1 ? directories[0] : `${directories.length} Directories`}
          size="small"
          onDelete={() => setFetchOptions({ directories: undefined })}
        />
      )}
      <IconButton size="small" onClick={() => setShowFilters(true)}>
        <FilterIcon fontSize="inherit" />
      </IconButton>
      <Popover
        open={showFilters}
        onClose={() => setShowFilters(false)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: -10,
          horizontal: 'right'
        }}
      >
        <Stack p={2} gap={1.5}>
          <YearSelector />
          <DirectorySelector />
          <SourceVisibilitySelector />
        </Stack>
      </Popover>
    </>
  )
}
