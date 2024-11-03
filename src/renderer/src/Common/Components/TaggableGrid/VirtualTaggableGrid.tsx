import { Box, Grid2 as Grid, Stack } from '@mui/material'
import { TaggableDisplay } from '@renderer/Common/Components/TaggableDisplay'
import { forwardRef } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'
import { BOX_WIDTH } from '../TaggableDisplay/TaggableDisplay'
import { CommonTaggableGridProps } from './TaggableGrid'
import { useEditTaggable } from '@renderer/TaggableBrowser/EditTaggableProvider'
import { useScrollLock } from '../../Hooks/useScrollLock'
import { Draggable } from '../DragAndDrop/Draggable'
import { Droppable, DroppableType } from '../DragAndDrop/Droppable'
import { isTaggableFile, isTaggableImage, isTaggableStack } from '@renderer/Common/taggable'
import { TaggableWrapper } from './TaggableWrapper'

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

export function VirtualTaggableGrid({ taggables, ...wrapperProps }: CommonTaggableGridProps) {
  if (!taggables) {
    return null
  }

  const editState = useEditTaggable()
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
          <TaggableWrapper taggable={f} {...wrapperProps} />
        </Stack>
      )}
    />
  )
}
