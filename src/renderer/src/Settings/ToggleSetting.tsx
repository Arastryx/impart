import { Stack, Box, Switch, Skeleton, Typography } from '@mui/material'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React, { useEffect, useState } from 'react'

//Acquired from https://stackoverflow.com/questions/50851263/how-do-i-require-a-keyof-to-be-for-a-property-of-a-specific-type
type BooleanKeys<T> = { [k in keyof T]: T[k] extends boolean ? k : never }[keyof T]

export interface ToggleSettingProps {
  storeKey: BooleanKeys<Impart.ConfigItems>
  title: string
  subtitle?: React.ReactNode
}

export function ToggleSetting({ storeKey, title, subtitle }: ToggleSettingProps) {
  const [checked, setChecked] = useState(true)

  const { data: actualSettingValue, isLoading } = useImpartIpcData(
    () => window.commonApi.getConfigItem(storeKey),
    [storeKey]
  )

  useEffect(() => {
    if (actualSettingValue) {
      setChecked(actualSettingValue?.result)
    }
  }, [actualSettingValue])

  const update = (checked: boolean) => {
    setChecked(checked)
    window.commonApi.setConfigItem(storeKey, checked)
  }

  return (
    <Stack direction="row" alignItems={'center'}>
      <Box width={100} textAlign="center">
        {!isLoading && (
          <Switch checked={checked} onChange={(e) => update(e.currentTarget.checked)} />
        )}
        {isLoading && <Skeleton />}
      </Box>
      <Box flex={1}>
        <Typography fontWeight="bold">{title}</Typography>
        <Typography variant="body2">{subtitle}</Typography>
      </Box>
    </Stack>
  )
}
