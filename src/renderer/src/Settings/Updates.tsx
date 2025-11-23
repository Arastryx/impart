import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export interface UpdatesProps {
  onShowPatchNotes?: () => void
}

export function Updates({ onShowPatchNotes }: UpdatesProps) {
  return (
    <Box>
      <Box mt={1} mb={2}>
        <Typography variant="h3">Updates</Typography>
      </Box>
      <Button onClick={onShowPatchNotes}>Show Patch Notes</Button>
    </Box>
  )
}
