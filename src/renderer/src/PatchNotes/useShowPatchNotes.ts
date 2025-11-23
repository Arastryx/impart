import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { useState, useEffect } from 'react'

export function useShowPatchNotes() {
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

  return { show, setShow }
}
