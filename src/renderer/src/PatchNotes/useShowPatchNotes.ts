import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { useState, useEffect } from 'react'

export function useShowPatchNotes() {
  const [show, setShow] = useState(false)

  const { data: previousVersion, isLoading: loadingVersion } = useImpartIpcData(
    () => window.commonApi.getConfigItem('previousVersion'),
    []
  )

  const { data: showPatchNotesOnUpdate, isLoading: loadingShowPatchNotes } = useImpartIpcData(
    () => window.commonApi.getConfigItem('showPatchNotesOnUpdate'),
    []
  )

  useEffect(() => {
    if (
      !loadingVersion &&
      !loadingShowPatchNotes &&
      showPatchNotesOnUpdate?.result &&
      previousVersion?.result != import.meta.env.PACKAGE_VERSION
    ) {
      setShow(true)
    }
  }, [previousVersion, loadingVersion, showPatchNotesOnUpdate, loadingShowPatchNotes])

  return { show, setShow }
}
