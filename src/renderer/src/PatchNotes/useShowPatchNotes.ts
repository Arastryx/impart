import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { useState, useEffect } from 'react'

export function useShowPatchNotes() {
  const [show, setShow] = useState(false)

  const { data: previousVersion, isLoading } = useImpartIpcData(
    () => window.commonApi.getConfigItem('previousVersion'),
    []
  )

  useEffect(() => {
    if (!isLoading && previousVersion?.result != import.meta.env.PACKAGE_VERSION) {
      setShow(true)
    }
  }, [previousVersion])

  return { show, setShow }
}
