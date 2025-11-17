import { Stack, Box, Card, CardActions, Fade } from '@mui/material'
import { ContextMenu } from '@renderer/Common/Components/ContextMenu'
import { VirtualTaggableGrid } from '@renderer/Common/Components/TaggableGrid'
import { useCallback, useEffect, useRef } from 'react'
import { GridActions } from './GridActions/GridActions'
import { SelectionIndicator } from './SelectionIndicator'
import { TaggableGridEvents, useTaggableContextMenuOptions } from './useTaggableContextMenuOptions'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { useMultiSelection } from '@renderer/Common/Hooks/useMultiSelection'
import { isTaggableStack } from '@renderer/Common/taggable'
import { GeneratingThumbnailIndicator } from './GeneratingThumbnailIndicator'
import { useEditTaggable } from '../EditTaggableProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTaggableSelection } from '@renderer/TaggableSelectionProvider'

export interface BrowserPanelProps extends Omit<TaggableGridEvents, 'onHide' | 'onOpenStack'> {}

export function BrowserPanel({ ...gridEvents }: BrowserPanelProps) {
  const { onBulkTag, onCreateStack, onEditTags } = gridEvents
  const { taggables, reload: fetchTaggables, stackTrail, setStackTrail } = useTaggables()

  const { selection, setSelection } = useTaggableSelection()

  useHotkeys('ctrl+a', (e) => {
    e.preventDefault()
    setSelection(taggables)
  })
  useHotkeys('ctrl+d', () => setSelection([]))
  useHotkeys('ctrl+e', () => {
    if (selection.length === 1) {
      onEditTags && onEditTags(selection[0])
    } else if (selection.length > 1) {
      onBulkTag && onBulkTag(selection)
    }
  })

  const selectedItemRef = useRef(false)

  const { selectItem, itemIsSelected } = useMultiSelection(
    taggables,
    selection,
    setSelection,
    useCallback((a, b) => a.id === b.id, []),
    { selectionActionOnItemChange: 'reset' }
  )
  const rightClickSelect = useCallback(
    (item: Impart.Taggable) => {
      if (!itemIsSelected(item)) {
        selectItem(item)
      }
    },
    [selectItem, itemIsSelected]
  )

  const editState = useEditTaggable()

  useEffect(() => {
    editState && editState.editTarget && editState.saveTagsAndClose()
  }, [selection])

  const options = useTaggableContextMenuOptions(selection, {
    ...gridEvents,
    onOpenStack: (t) => setStackTrail(stackTrail.concat([t])),
    onHide: async (taggables) => {
      await window.taggableApi.setHidden(
        taggables.map((t) => t.id),
        true
      )
      fetchTaggables()
    }
  })

  return (
    <ContextMenu
      options={options}
      render={({ open }) => (
        <Stack
          position={'relative'}
          height="100%"
          pr={1}
          gap={2}
          onClick={() => {
            if (!selectedItemRef.current) {
              setSelection([])
            }

            selectedItemRef.current = false
          }}
          onContextMenu={() => (selectedItemRef.current = false)}
        >
          <Box mt={1} pl={1}>
            <Card>
              <CardActions>
                <GridActions stack={stackTrail} onStackChange={setStackTrail} />
              </CardActions>
            </Card>
          </Box>

          <VirtualTaggableGrid
            taggables={taggables}
            selection={selection}
            dragAndDrop
            onMouseDown={(e, t) => {
              if (e.button === 0 && (!itemIsSelected(t) || e.shiftKey || e.ctrlKey)) {
                selectedItemRef.current = true
                selectItem(t, e.ctrlKey, e.shiftKey)
              }
            }}
            onClick={(e, t) => {
              if (itemIsSelected(t) && !selectedItemRef.current) {
                selectedItemRef.current = true
                selectItem(t)
              }
            }}
            onRightClick={(e, item) => {
              rightClickSelect(item)
              open(e)
            }}
            onDoubleClick={(t) => isTaggableStack(t) && setStackTrail(stackTrail.concat([t]))}
          />

          <Fade in={selection.length > 0}>
            <Box position="absolute" bottom={10} left={10}>
              <SelectionIndicator
                count={selection.length}
                onTag={() =>
                  selection.length == 1
                    ? onEditTags && onEditTags(selection[0])
                    : onBulkTag && onBulkTag(selection)
                }
                onCreateStack={() => onCreateStack && onCreateStack(selection)}
                onClear={() => setSelection([])}
              />
            </Box>
          </Fade>
          <Box position="absolute" bottom={10} right={40}>
            <GeneratingThumbnailIndicator />
          </Box>
        </Stack>
      )}
    ></ContextMenu>
  )
}
