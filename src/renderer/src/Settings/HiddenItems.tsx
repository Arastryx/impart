import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  Stack,
  Typography,
  darken,
  styled
} from '@mui/material'
import { isTaggableStack } from '@renderer/Common/taggable'
import { useImpartIpcCall, useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { useMultiSelection } from '@renderer/Common/Hooks/useMultiSelection'
import React, { useState } from 'react'
import ImageIcon from '@mui/icons-material/ImageRounded'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

const SelectableBox = styled(Box)<BoxProps & { selected: boolean }>(({ theme, selected }) => {
  const plainSelectedColor = selected ? theme.palette.primary.main : theme.palette.background.paper
  const evenColor = selected
    ? darken(theme.palette.primary.main, 0.06)
    : darken(theme.palette.background.paper, 0.06)
  const hoverColor = selected
    ? darken(theme.palette.primary.main, 0.09)
    : darken(theme.palette.background.paper, 0.09)
  const evenHoverColor = selected
    ? darken(theme.palette.primary.main, 0.15)
    : darken(theme.palette.background.paper, 0.15)

  const toStyle = (color: string) => ({
    backgroundColor: color,
    color: theme.palette.getContrastText(color)
  })

  return {
    cursor: 'pointer',
    userSelect: 'none',
    ...toStyle(plainSelectedColor),
    '&:nth-of-type(2n-1)': toStyle(evenColor),
    '&:hover': toStyle(hoverColor),
    '&:nth-of-type(2n-1):hover': toStyle(evenHoverColor)
  }
})

export interface HiddenItemsProps {}

export function HiddenItems({}: HiddenItemsProps) {
  const { reload: reloadTaggableGrid } = useTaggables()
  const { data: hiddenTaggables, reload } = useImpartIpcData(
    () => window.taggableApi.getTaggables({ onlyHidden: true, order: 'alpha' }),
    []
  )

  const [selection, setSelection] = useState<Impart.Taggable[]>([])

  const { callIpc: unhideItems, isLoading } = useImpartIpcCall(
    () =>
      window.taggableApi.setHidden(
        selection.map((t) => t.id),
        false
      ),
    [selection]
  )

  const { selectItem, itemIsSelected } = useMultiSelection(
    hiddenTaggables ?? [],
    selection,
    setSelection,
    (a, b) => a.id === b.id
  )

  return (
    <Box>
      <Box mt={1} mb={2}>
        <Typography variant="h3">Hidden Items</Typography>
      </Box>
      <Stack>
        {hiddenTaggables?.length === 0 && (
          <Typography color="text.secondary" fontStyle="italic" textAlign="center">
            No items hidden.
          </Typography>
        )}
        {hiddenTaggables?.map((t) => (
          <SelectableBox
            key={t.id}
            p={0.5}
            selected={itemIsSelected(t)}
            onClick={(e) => selectItem(t, e.ctrlKey, e.shiftKey)}
            sx={(theme) => ({})}
          >
            <Typography>{isTaggableStack(t) ? t.name : t.fileIndex.fileName}</Typography>
          </SelectableBox>
        ))}
      </Stack>
      <Box textAlign="right" pt={2}>
        {!isLoading && (
          <Button
            variant="contained"
            startIcon={<ImageIcon />}
            disabled={selection.length === 0}
            onClick={async () => {
              await unhideItems()
              reload()
              reloadTaggableGrid()
            }}
          >
            Unhide{' '}
            {selection.length > 0
              ? `${selection.length} item${selection.length === 1 ? '' : 's'}`
              : ''}
          </Button>
        )}
        {isLoading && <CircularProgress />}
      </Box>
    </Box>
  )
}
