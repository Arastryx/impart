import { useSetting } from '@renderer/Common/Contexts/SettingsProvider'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { useState, useEffect } from 'react'

export function useShowPatchNotes() {
  const [show, setShow] = useState(false)

  const { data: previousVersion, isLoading: loadingVersion } = useImpartIpcData(
    () => window.commonApi.getConfigItem('previousVersion'),
    []
  )

  const { setting: showPatchNotesOnUpdate, isLoading: loadingShowPatchNotes } =
    useSetting('showPatchNotesOnUpdate')

  useEffect(() => {
    if (
      !loadingVersion &&
      !loadingShowPatchNotes &&
      showPatchNotesOnUpdate &&
      previousVersion?.result != import.meta.env.PACKAGE_VERSION
    ) {
      setShow(true)
    }
  }, [previousVersion, loadingVersion, showPatchNotesOnUpdate, loadingShowPatchNotes])

  return { show, setShow }
}
