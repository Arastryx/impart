import { Box, Card, IconButton, Stack, Tooltip, Typography } from '@mui/material'

import SettingsIcon from '@mui/icons-material/SettingsRounded'
import BlockIcon from '@mui/icons-material/Block'
import { useState } from 'react'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface SettingsPanelProps {
  onSettingsClick?: () => void
}

export function SettingsPanel({ onSettingsClick }: SettingsPanelProps) {
  const { fetchOptions, setFetchOptions } = useTaggables()

  return (
    <Card>
      <Stack direction="row" p={0.25} alignItems={'center'}>
        <Tooltip title="Folders">
          <IconButton onClick={() => onSettingsClick && onSettingsClick()}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle NSFW">
          <IconButton onClick={() => setFetchOptions({ allowNsfw: !fetchOptions.allowNsfw })}>
            <Box position="relative">
              <Typography fontWeight="bold" fontSize={20} lineHeight={1}>
                18
              </Typography>
              {!fetchOptions.allowNsfw && (
                <BlockIcon sx={{ position: 'absolute', top: -8, left: -5, fontSize: 36 }} />
              )}
            </Box>
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  )
}
