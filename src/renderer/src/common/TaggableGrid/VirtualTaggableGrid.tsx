import { Box, Grid2 as Grid, Stack } from '@mui/material'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { forwardRef } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'
import { BOX_WIDTH } from '../TaggableDisplay/TaggableDisplay'
import { CommonTaggableGridProps } from './TaggableGrid'
import { useEditTags } from '@renderer/TaggableBrowser/EditTagsProvider'
import { useScrollLock } from '../useScrollLock'

const gridComponents: GridComponents = {
  List: forwardRef(({ children, ...props }, ref) => (
    <Grid container {...props} ref={ref}>
      {children}
    </Grid>
  )),
  Item: forwardRef(({ children, ...props }, ref) => (
    <Grid minWidth={BOX_WIDTH + 28} {...props} ref={ref} size={{ xs: 'grow' }}>
      {children}
    </Grid>
  ))
}

export function VirtualTaggableGrid({
  taggables,
  selection,
  onSelect,
  onRightClick,
  onDoubleClick
}: CommonTaggableGridProps) {
  if (!taggables) {
    return null
  }

  const editState = useEditTags()
  const handleScroll = useScrollLock(editState && editState.editTarget != null)

  return (
    <VirtuosoGrid
      data={taggables}
      totalCount={taggables.length}
      components={gridComponents}
      onScroll={handleScroll}
      computeItemKey={(index, item) => item.id}
      itemContent={(index, f) => (
        <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
          <Box
            onContextMenu={(e) => {
              onRightClick && onRightClick(f, e)
              e.stopPropagation()
            }}
            onClick={(e) => {
              onSelect && onSelect(f, e.ctrlKey, e.shiftKey)
              e.stopPropagation()
            }}
            onDoubleClick={() => onDoubleClick && onDoubleClick(f)}
          >
            <TaggableDisplay taggable={f} isSelected={selection?.some((s) => s.id === f.id)} />
          </Box>
        </Stack>
      )}
    />
  )
}
