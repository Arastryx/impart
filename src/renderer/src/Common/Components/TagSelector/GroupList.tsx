import { satisfiesFilter } from './satisfiesFilter'
import { Droppable } from '../DragAndDrop/Droppable'
import { Draggable } from '../DragAndDrop'
import { TagGroup } from './TagGroup'
import { GroupCollapse } from './useGroupCollapse'
import { GroupDropIndicator } from './GroupDropIndicator'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

export interface GroupListProps {
  filter?: string
  selection?: Impart.Tag[]
  exclusion?: Impart.Tag[]
  collapsedGroups: GroupCollapse
  onToggleCollapse?: (id: number) => void
  onSelect?: (tag: Impart.Tag) => void
  onExclude?: (tag: Impart.Tag) => void
}

export function GroupList({
  filter,
  onSelect,
  onExclude,
  onToggleCollapse,
  selection,
  exclusion,
  collapsedGroups
}: GroupListProps) {
  const { groups } = useTagGroups()
  const {
    fetchOptions: { allowNsfw }
  } = useTaggables()

  return (
    <>
      {groups
        ?.filter(
          (g) => (g.tags?.length == 0 && !filter) || g.tags?.some((t) => satisfiesFilter(t, filter))
        )
        .filter((g) => allowNsfw || g.tags?.some((t) => !t.isNsfw))
        .map((g) => (
          <Droppable
            key={g.id}
            id={g.id}
            type="tagGroup"
            hideIndicator
            render={({ overType }) => (
              <GroupDropIndicator showIndicator={overType === 'tagGroup'}>
                <Draggable type="tagGroup" id={g.id} exposeHandle>
                  <TagGroup
                    group={g}
                    selectedTags={selection}
                    excludedTags={exclusion}
                    filter={filter}
                    onSelect={onSelect}
                    onExclude={onExclude}
                    collapsed={collapsedGroups[g.id]}
                    onToggleCollapse={() => onToggleCollapse?.(g.id)}
                  />
                </Draggable>
              </GroupDropIndicator>
            )}
          />
        ))}
    </>
  )
}
