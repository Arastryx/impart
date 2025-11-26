import { Box, Button, CircularProgress, Skeleton, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'

export interface UpdatesProps {
  onShowPatchNotes?: () => void
}

export function Updates({ onShowPatchNotes }: UpdatesProps) {
  const [autoUpdate, setAutoUpdate] = useState(true)

  const { data: autoUpdateValue, isLoading } = useImpartIpcData(
    () => window.commonApi.getConfigItem('autoUpdatingEnabled'),
    []
  )

  useEffect(() => {
    if (autoUpdateValue) {
      setAutoUpdate(autoUpdateValue?.result)
    }
  }, [autoUpdateValue])

  const update = (checked: boolean) => {
    setAutoUpdate(checked)
    window.commonApi.setConfigItem('autoUpdatingEnabled', checked)
  }

  return (
    <Box>
      <Stack mt={1} mb={2} direction="row" gap={2} alignItems="center">
        <Typography variant="h3">Updates</Typography>
        <Button
          onClick={onShowPatchNotes}
          variant="outlined"
          startIcon={<FormatListBulletedIcon />}
        >
          Show Patch Notes
        </Button>
      </Stack>
      <Stack direction="row" alignItems={'center'}>
        <Box width={100} textAlign="center">
          {!isLoading && (
            <Switch checked={autoUpdate} onChange={(e) => update(e.currentTarget.checked)} />
          )}
          {isLoading && <Skeleton />}
        </Box>
        <Box flex={1}>
          <Typography fontWeight="bold">Enable Auto Updating</Typography>
          <Typography variant="body2">
            Auto-updating takes place whenever the app starts up. If disabled, updates can always be
            installed the conventional way (downloading them from{' '}
            <a href="https://arastryx.itch.io/impart" target="_blank">
              Itch.io
            </a>{' '}
            or{' '}
            <a href="https://github.com/Arastryx/impart/releases" target="_blank">
              GitHub
            </a>
            ).{' '}
            <Typography variant="caption" component="span" color="primary.light">
              TODO: Implement fancy "Check For Updates" button and so on
            </Typography>
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}
