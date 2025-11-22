import { Dialog, DialogContent, DialogTitle, Divider, Stack } from '@mui/material'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React, { useEffect, useState } from 'react'
import { Patch1_2_0 } from './Patches/Patch1_2_0'
import { PatchOld } from './Patches/PatchOld'

export interface PatchNotesProps {}

export function PatchNotes({}: PatchNotesProps) {
  const [show, setShow] = useState(false)

  const { data: previousVersion, isLoading } = useImpartIpcData(
    () => window.commonApi.getPreviousVersion(),
    []
  )

  useEffect(() => {
    console.log(isLoading, previousVersion?.version, import.meta.env.PACKAGE_VERSION)

    if (!isLoading && previousVersion?.version != import.meta.env.PACKAGE_VERSION) {
      setShow(true)
    }
  }, [previousVersion])

  return (
    <Dialog open={show} onClose={() => setShow(false)} maxWidth="xl" fullWidth>
      <DialogTitle variant="h2">Patch Notes</DialogTitle>
      <DialogContent>
        <Stack gap={5} divider={<Divider />}>
          <Patch1_2_0 />
          <PatchOld />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
