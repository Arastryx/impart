import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

export interface PatchOldProps {}

export function PatchOld({}: PatchOldProps) {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        v1.1.0 (and earlier)
      </Typography>
      <Stack textAlign="center" alignItems="center">
        <Stack
          bgcolor="primary.light"
          width={400}
          height={200}
          alignItems="center"
          justifyContent="center"
          color="white"
          mb={2}
        >
          [ART]
        </Stack>
        <Typography>Oops! I didn't start recording patch notes until v1.2.0! Sorry!</Typography>
      </Stack>
    </Box>
  )
}
