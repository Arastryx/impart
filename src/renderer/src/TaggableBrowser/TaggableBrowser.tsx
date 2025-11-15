import { Stack, Box, Collapse, Card, CardContent, useMediaQuery, useTheme } from '@mui/material'
import { SettingsPanel } from './SettingsPanel'
import { TaskStatus } from '../Common/Components/TaskStatus'
import { TaggableGridEvents } from './BrowserPanel/useTaggableContextMenuOptions'
import { useShowIndexingPanel } from './useShowIndexingPanel'
import { BrowserPanel } from './BrowserPanel'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TagSelector } from '@renderer/Common/Components/TagSelector'
import { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react'
import { EditTaggableProvider } from './EditTaggableProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'

export interface TaggableBrowserProps extends Omit<TaggableGridEvents, 'onEditTags'> {
  onSettingsPressed?: () => void
}

export function TaggableBrowser({ onSettingsPressed, ...gridEvents }: TaggableBrowserProps) {
  const showIndexingPanel = useShowIndexingPanel()
  const {
    reload: fetchTaggables,
    setFetchOptions,
    fetchOptions: { tagIds, excludedTagIds }
  } = useTaggables()

  const [editTarget, setEditTarget] = useState<Impart.Taggable>()
  const [renameTarget, setRenameTarget] = useState<Impart.TaggableStack>()
  const [editTagSelection, setEditTagSelection] = useState<Impart.Tag[]>([])

  useHotkeys('escape', () => {
    if (editTarget || renameTarget) {
      setEditTarget(undefined)
      setRenameTarget(undefined)
      setEditTagSelection([])
    }
  })

  const { tags } = useTagGroups()
  const selectedTags = useMemo(
    () => tags?.filter((t) => tagIds?.some((id) => t.id === id)),
    [tags, tagIds]
  )
  const excludedTags = useMemo(
    () => tags?.filter((t) => excludedTagIds?.some((id) => t.id === id)),
    [tags, excludedTagIds]
  )

  const theme = useTheme()
  const xl = useMediaQuery(theme.breakpoints.up('xl'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <EditTaggableProvider
      editTarget={editTarget}
      renameTarget={renameTarget}
      tags={editTagSelection}
      onRemoveTag={(t) => {
        const copy = editTagSelection.slice()
        const index = copy.findIndex((c) => c.id === t.id)

        if (index != -1) {
          copy.splice(index, 1)
          setEditTagSelection(copy)
        }
      }}
      onFinish={() => {
        fetchTaggables()
        setEditTarget(undefined)
        setRenameTarget(undefined)
      }}
    >
      <Box height="100vh">
        <PanelGroup autoSaveId="taggableBrowser" direction="horizontal">
          <Panel>
            <BrowserPanel
              {...gridEvents}
              onEditTags={(t) => {
                setEditTarget(t)
                setEditTagSelection(t.tags)
              }}
              onRenameStack={setRenameTarget}
            />
          </Panel>

          <PanelResizeHandle />
          <Panel defaultSize={25} minSize={xl ? 12 : lg ? 15 : 20}>
            <Box py={1} pr={1} height="100%">
              <Stack width="100%" height="100%">
                <Card sx={{ flex: 1, overflowY: 'auto' }}>
                  <CardContent sx={{ height: '100%' }}>
                    <TagSelector
                      selection={editTarget ? editTagSelection : selectedTags}
                      exclusion={editTarget ? [] : excludedTags}
                      onSelectionChange={(tags) => {
                        if (editTarget) {
                          setEditTagSelection(tags)
                        } else {
                          setFetchOptions({
                            tagIds: tags.map((t) => t.id)
                          })
                        }
                      }}
                      onExclusionChange={(excludedTags) => {
                        if (!editTarget) {
                          setFetchOptions({
                            excludedTagIds: excludedTags?.map((t) => t.id)
                          })
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                <Collapse in={showIndexingPanel}>
                  <Box pt={2}>
                    <Card>
                      <CardContent>
                        <TaskStatus />
                      </CardContent>
                    </Card>
                  </Box>
                </Collapse>
                <Box pt={2}>
                  <SettingsPanel onSettingsClick={() => onSettingsPressed && onSettingsPressed()} />
                </Box>
              </Stack>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>
    </EditTaggableProvider>
  )
}
