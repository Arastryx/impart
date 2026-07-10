import { Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React, { useEffect, useState } from 'react'
import { Patch1_2_0 } from './Patches/Patch1_2_0'
import { PatchOld } from './Patches/PatchOld'
import { ToggleSetting } from '@renderer/Settings/ToggleSetting'
import { Patch1_3_0 } from './Patches/Patch1_3_0'

export interface PatchNotesProps {
  show: boolean
  onClose: () => void
}

export function PatchNotes({ show, onClose }: PatchNotesProps) {
  return (
    <Dialog open={show} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent={'space-between'} alignItems={'flex-start'}>
          <Typography variant="h2">Patch Notes</Typography>
          <ToggleSetting storeKey="showPatchNotesOnUpdate" title="Show on update" small />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack gap={5} divider={<Divider />}>
          <Patch1_3_0 />
          <Patch1_2_0 />
          <PatchOld />
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
