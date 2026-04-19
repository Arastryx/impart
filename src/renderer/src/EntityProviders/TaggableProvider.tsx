import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { usePartialState } from '@renderer/Common/Hooks/usePartialState'
import { useTaskStatus } from '@renderer/TaskStatusProvider'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { useTagGroups } from './TagProvider'

interface TaggableData {
  taggables: Impart.Taggable[]
  isLoading: boolean
  reload: () => Promise<void>
  fetchOptions: Impart.FetchTaggablesOptions
  setFetchOptions: (options: Partial<Impart.FetchTaggablesOptions>) => void
  stackTrail: Impart.TaggableStack[]
  setStackTrail: (stackTrail: Impart.TaggableStack[]) => void
}

const TaggableContext = createContext<TaggableData | null>(null)

export interface TaggableProviderProps {
  children?: React.ReactNode
}

const DEFAULT_ORDER_KEY = 'defaultOrder'
const DEFAULT_PRIVATE_KEY = 'defaultPrivate'

export function TaggableProvider({ children }: TaggableProviderProps) {
  const { isTaskRunning } = useTaskStatus()
  const { tags } = useTagGroups()

  const [stackTrail, setStackTrail] = useState<Impart.TaggableStack[]>([])
  const [fetchOptions, setFetchOptions] = usePartialState<Impart.FetchTaggablesOptions>(
    () =>
      ({
        order: (localStorage.getItem(DEFAULT_ORDER_KEY) as 'alpha' | 'date' | null) ?? 'alpha',
        allowPrivate: (localStorage.getItem(DEFAULT_PRIVATE_KEY) as boolean | null) ?? true,
        excludedTagIds: tags?.filter((t) => t.excludeByDefault).map((t) => t.id)
      }) satisfies Impart.FetchTaggablesOptions
  )

  const updateStackTrail = useCallback((stack: Impart.TaggableStack[]) => {
    setStackTrail(stack)
    setFetchOptions({ search: undefined, tagIds: undefined })
  }, [])

  useEffect(() => {
    setFetchOptions({
      stackId: stackTrail.length > 0 ? stackTrail[stackTrail.length - 1].id : undefined
    })
  }, [stackTrail])

  const {
    data: taggables,
    isLoading,
    reload
  } = useImpartIpcData(() => window.taggableApi.getTaggables(fetchOptions), [fetchOptions])

  useEffect(() => {
    if (fetchOptions.order) {
      localStorage.setItem(DEFAULT_ORDER_KEY, fetchOptions.order)
    }
  }, [fetchOptions.order])

  useEffect(() => {
    if (isTaskRunning) {
      let interval = setInterval(() => reload(), 1000)

      return () => clearInterval(interval)
    } else {
      reload()
    }
  }, [isTaskRunning, reload])

  return (
    <TaggableContext.Provider
      value={{
        taggables: taggables ?? [],
        isLoading,
        reload,
        fetchOptions,
        setFetchOptions,
        stackTrail,
        setStackTrail: updateStackTrail
      }}
    >
      {children}
    </TaggableContext.Provider>
  )
}

export function useTaggables() {
  const result = useContext(TaggableContext)

  if (!result) {
    throw new Error(
      'useTaggableIndexStatus() cannot be used without being wrapped by a TaggableIndexStatusProvider'
    )
  }

  return result
}

