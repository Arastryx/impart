import { Dialog, DialogContent, DialogTitle, Divider, Stack } from '@mui/material'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React, { useEffect, useState } from 'react'
import { Patch1_2_0 } from './Patches/Patch1_2_0'
import { PatchOld } from './Patches/PatchOld'

export interface PatchNotesProps {
  show: boolean
  onClose: () => void
}

export function PatchNotes({ show, onClose }: PatchNotesProps) {
  return (
    <Dialog open={show} onClose={onClose} maxWidth="xl" fullWidth>
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
