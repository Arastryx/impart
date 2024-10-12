import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'
import { useErrorNotification } from '../Components/ErrorNotificationProvider'

type AsyncCall<Params extends any[], Result> = (...params: Params) => Promise<Result>

export function useImpartIpcCall<Params extends any[], Result>(
  call: AsyncCall<Params, Result | Impart.Error>,
  deps: DependencyList
): { callIpc: AsyncCall<Params, Exclude<Result, Impart.Error> | undefined>; isLoading: boolean } {
  const [isLoading, setLoading] = useState(false)
  const sendError = useErrorNotification()
  const callIpc = useCallback<AsyncCall<Params, Exclude<Result, Impart.Error> | undefined>>(
    async (...params: Params) => {
      setLoading(true)
      const result = await call(...params)
      setLoading(false)

      if (isNotError(result)) {
        return result
      } else if (isError(result)) {
        sendError(result.message)
      }
    },
    [...deps, sendError]
  )

  return { callIpc, isLoading }
}

function isNotError<T>(
  result: T | Impart.Error
): result is Exclude<T | Impart.Error, Impart.Error> {
  return !isError(result)
}

function isError(result: any): result is Impart.Error {
  return result?.message != null
}

export function useImpartIpcData<Result>(
  call: AsyncCall<[], Result | Impart.Error>,
  deps: DependencyList
) {
  const [data, setData] = useState<Result>()

  //This needs its own loading state since it gets initialized to true instead of false
  const [isLoading, setLoading] = useState(true)
  const { callIpc, isLoading: _discarded, ...everythingElse } = useImpartIpcCall(call, deps)

  const requestIdRef = useRef(0)

  const loadData = useCallback(async () => {
    requestIdRef.current++
    const requestId = requestIdRef.current
    setLoading(true)
    const result = await callIpc()

    if (requestId === requestIdRef.current) {
      setLoading(false)
      setData(result)
    }
  }, [callIpc])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, isLoading, reload: loadData, ...everythingElse }
}
