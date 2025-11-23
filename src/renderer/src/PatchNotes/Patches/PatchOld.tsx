import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import wump from './wump.png'

export interface PatchOldProps {}

export function PatchOld({}: PatchOldProps) {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        v1.1.0 (and earlier)
      </Typography>
      <Stack textAlign="center" alignItems="center">
        <Box component="img" src={wump} />
        <Typography>Oops! I didn't start recording patch notes until v1.2.0! Sorry!</Typography>
      </Stack>
    </Box>
  )
}
