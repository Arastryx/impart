import { createContext, useContext, useMemo } from 'react'
import { useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { CircularProgress } from '@mui/material'

interface TagData {
  groups?: Impart.TagGroup[]
  tags?: Impart.Tag[]
  isLoading: boolean
  reload: () => Promise<void>
}

const TagContext = createContext<TagData | null>(null)

export interface TagProviderProps {
  children?: React.ReactNode
}

export function TagProvider({ children }: TagProviderProps) {
  const { data: groups, isLoading, reload } = useImpartIpcData(() => window.tagApi.getGroups(), [])

  const tags = useMemo(() => groups?.map((g) => g.tags ?? []).flat(), [groups])

  return (
    <TagContext.Provider value={{ groups, tags, isLoading, reload }}>
      {children}
    </TagContext.Provider>
  )
}

export function useTagGroups() {
  const result = useContext(TagContext)

  if (!result) {
    throw new Error(
      'useTaggableIndexStatus() cannot be used without being wrapped by a TaggableIndexStatusProvider'
    )
  }

  return result
}
