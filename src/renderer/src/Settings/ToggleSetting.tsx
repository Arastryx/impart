import { Stack, Box, Switch, Skeleton, Typography } from '@mui/material'
import { useSetting } from '@renderer/Common/Contexts/SettingsProvider'
import { useImpartIpcCall, useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React, { useEffect, useState } from 'react'

//Acquired from https://stackoverflow.com/questions/50851263/how-do-i-require-a-keyof-to-be-for-a-property-of-a-specific-type
type BooleanKeys<T> = { [k in keyof T]: T[k] extends boolean ? k : never }[keyof T]

export interface ToggleSettingProps {
  storeKey: BooleanKeys<Impart.ConfigItems>
  title: string
  subtitle?: React.ReactNode
  small?: boolean
}

export function ToggleSetting({ storeKey, title, subtitle, small }: ToggleSettingProps) {
  const [checked, setChecked] = useState(true)

  const { setting, updateSetting, isLoading } = useSetting(storeKey)

  useEffect(() => {
    if (setting !== undefined) {
      setChecked(setting)
    }
  }, [setting])

  const update = (checked: boolean) => {
    setChecked(checked)
    updateSetting(checked)
  }

  return (
    <Stack direction="row" alignItems={'center'}>
      <Box width={small ? 60 : 80} textAlign="center">
        {!isLoading && (
          <Switch
            checked={checked}
            onChange={(e) => update(e.currentTarget.checked)}
            size={small ? 'small' : 'medium'}
          />
        )}
        {isLoading && <Skeleton />}
      </Box>
      <Box flex={1}>
        <Typography variant={small ? 'body2' : 'body1'} fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2">{subtitle}</Typography>
      </Box>
    </Stack>
  )
}
