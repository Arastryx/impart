import { Stack, Button, Box, Divider, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/AddRounded'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { useCallback, useState } from 'react'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { SearchBar } from '../SearchBar'
import { Droppable } from '../DragAndDrop/Droppable'
import { TagSelection } from './TagSelection'
import { EmptyTagGroups } from './EmptyTagGroups'
import { useGroupCollapse } from './useGroupCollapse'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import { GroupDropIndicator } from './GroupDropIndicator'
import { GroupList } from './GroupList'

export interface TagSelectorProps {
  selection?: Impart.Tag[]
  exclusion?: Impart.Tag[]
  onSelectionChange?: (selection: Impart.Tag[]) => void
  onExclusionChange?: (selection: Impart.Tag[]) => void
}

function anyHaveValue<T>(...arrays: (T[] | undefined)[]) {
  return arrays.some((t) => (t?.length ?? 0) > 0)
}

export function TagSelector({
  selection,
  exclusion,
  onSelectionChange,
  onExclusionChange
}: TagSelectorProps) {
  const { collapsedGroups, toggleGroupCollapse, expandAll, collapseAll } = useGroupCollapse()
  const { groups, reload, tags } = useTagGroups()

  const { selectItem: toggleSelection, itemIsSelected } = useMultiSelection(
    tags ?? [],
    selection ?? [],
    (s) => onSelectionChange && onSelectionChange(s),
    useCallback((a, b) => a.id === b.id, []),
    { toggleMode: true }
  )

  const { selectItem: toggleExclusion, itemIsSelected: itemIsExcluded } = useMultiSelection(
    tags ?? [],
    exclusion ?? [],
    (s) => onExclusionChange && onExclusionChange(s),
    useCallback((a, b) => a.id === b.id, []),
    { toggleMode: true }
  )

  const [filter, setFilter] = useState<string>()

  const explicitlyExcludedTags = exclusion?.filter((t) => !t.excludeByDefault)
  const includedExclusionTags = tags?.filter(
    (t) =>
      t.excludeByDefault &&
      !exclusion?.some((e) => e.id == t.id) &&
      !selection?.some((s) => s.id == t.id)
  )

  if (groups?.length === 0) {
    return <EmptyTagGroups />
  }

  return (
    <Stack height="100%" gap={2} justifyContent="space-between">
      <Stack
        gap={1}
        sx={{
          '& .MuiButton-root': {
            opacity: 0,
            transition: '0.2s'
          },
          '&:hover .MuiButton-root': {
            opacity: 1
          }
        }}
      >
        <Stack direction="row" alignItems="center">
          <SearchBar value={filter} onChange={setFilter} />
          <Tooltip title="Collapse All">
            <IconButton sx={{ ml: 1 }} onClick={() => collapseAll(groups?.map((g) => g.id) ?? [])}>
              <UnfoldLessIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Expand All" onClick={() => expandAll(groups?.map((g) => g.id) ?? [])}>
            <IconButton>
              <UnfoldMoreIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <GroupList
          filter={filter}
          selection={selection}
          exclusion={exclusion}
          collapsedGroups={collapsedGroups}
          onToggleCollapse={toggleGroupCollapse}
          onSelect={(t) => {
            toggleSelection(t)
            if (itemIsExcluded(t)) {
              toggleExclusion(t)
            }
          }}
          onExclude={(t) => {
            toggleExclusion(t)
            if (itemIsSelected(t)) {
              toggleSelection(t)
            }
          }}
        />
        <Droppable
          type="tagGroup"
          id={-1}
          hideIndicator
          render={({ overType }) => (
            <GroupDropIndicator showIndicator={overType === 'tagGroup'}>
              <Button
                onClick={async () => {
                  await window.tagApi.createGroup()
                  reload()
                }}
                fullWidth
              >
                <AddIcon />
              </Button>
            </GroupDropIndicator>
          )}
        />
      </Stack>
      {anyHaveValue(selection, explicitlyExcludedTags, includedExclusionTags) && (
        <Box position={'sticky'} bgcolor="background.paper" bottom={0} pb={2}>
          <Divider />
          <TagSelection
            selection={selection}
            exclusion={explicitlyExcludedTags}
            includedExclusions={includedExclusionTags}
            onClickSelected={toggleSelection}
            onClickExcluded={toggleExclusion}
            onClickIncludedExclusion={toggleExclusion}
            onClear={() => {
              onSelectionChange && onSelectionChange([])
              onExclusionChange && onExclusionChange(tags?.filter((t) => t.excludeByDefault) ?? [])
            }}
          />
        </Box>
      )}
    </Stack>
  )
}
