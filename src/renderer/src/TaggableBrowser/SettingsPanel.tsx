import { Box, Card, IconButton, Stack, Tooltip, Typography } from '@mui/material'

import SettingsIcon from '@mui/icons-material/SettingsRounded'
import SheildIcon from '@mui/icons-material/Shield'
import NoShieldIcon from '@mui/icons-material/RemoveModerator'
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
        <Tooltip title="Toggle Private Tags">
          <IconButton onClick={() => setFetchOptions({ allowPrivate: !fetchOptions.allowPrivate })}>
            {!fetchOptions.allowPrivate && <SheildIcon />}
            {fetchOptions.allowPrivate && <NoShieldIcon />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  )
}

