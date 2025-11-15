import { useLocalStorage } from '@renderer/Common/Hooks/useLocalStorage'
import { produce } from 'immer'
import { useCallback } from 'react'

const COLLAPSED_GROUPS_KEY = 'collapsed_groups'

export interface GroupCollapse {
  [groupId: number]: boolean
}

export function useGroupCollapse() {
  const [collapsedGroups, setCollapsedGroups] = useLocalStorage<GroupCollapse>(
    COLLAPSED_GROUPS_KEY,
    {}
  )

  const toggleGroupCollapse = useCallback(
    (id: number) => {
      setCollapsedGroups(
        produce(collapsedGroups, (draft) => {
          draft[id] = !draft[id]
        })
      )
    },
    [collapsedGroups]
  )

  const expandAll = useCallback(
    (groupIds: number[]) =>
      setCollapsedGroups(
        groupIds.reduce((obj, current) => {
          obj[current] = false
          return obj
        }, {})
      ),
    []
  )

  const collapseAll = useCallback(
    (groupIds: number[]) =>
      setCollapsedGroups(
        groupIds.reduce((obj, current) => {
          obj[current] = true
          return obj
        }, {})
      ),
    []
  )

  return { collapsedGroups, toggleGroupCollapse, expandAll, collapseAll }
}
