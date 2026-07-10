import { MenuItem, TextField } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import React from 'react'

export interface SourceVisibilitySelectorProps {}

export function SourceVisibilitySelector({}: SourceVisibilitySelectorProps) {
  const { fetchOptions, setFetchOptions } = useTaggables()

  return (
    <TextField
      label="Displayed Files"
      select
      value={fetchOptions.sourceFiles ?? 'unassociated'}
      onChange={(e) => setFetchOptions({ sourceFiles: e.target.value as Impart.SourceFileFilter })}
      size="small"
    >
      <MenuItem value="all">Show all images and files</MenuItem>
      <MenuItem value="unassociated">Exclude associated files</MenuItem>
      <MenuItem value="only">Only show files</MenuItem>
      <MenuItem value="onlyUnassociated">Only show unassociated files</MenuItem>
      <MenuItem value="none">Only show images</MenuItem>
    </TextField>
  )
}
