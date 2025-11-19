import { Dialog, DialogContent } from '@mui/material'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import React, { useEffect, useState } from 'react'

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
    <Dialog open={show} onClose={() => setShow(false)}>
      <DialogContent>Hello! {previousVersion?.version}</DialogContent>
    </Dialog>
  )
}
