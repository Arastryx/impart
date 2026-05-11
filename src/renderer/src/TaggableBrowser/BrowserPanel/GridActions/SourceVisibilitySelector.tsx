import { MenuItem, TextField } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import React from 'react'

export interface SourceVisibilitySelectorProps {}

export function SourceVisibilitySelector({}: SourceVisibilitySelectorProps) {
  const { fetchOptions, setFetchOptions } = useTaggables()

  return (
    <TextField
      label="Non-Image Files"
      select
      value={fetchOptions.sourceFiles ?? 'unassociated'}
      onChange={(e) => setFetchOptions({ sourceFiles: e.target.value as Impart.SourceFileFilter })}
      size="small"
    >
      <MenuItem value="only">Only</MenuItem>
      <MenuItem value="onlyUnassociated">Only Unassociated</MenuItem>
      <MenuItem value="all">All</MenuItem>
      <MenuItem value="unassociated">Unassociated</MenuItem>
      <MenuItem value="none">None</MenuItem>
    </TextField>
  )
}
