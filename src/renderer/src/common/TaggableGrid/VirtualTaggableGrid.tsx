import { Box, Grid2 as Grid } from '@mui/material'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import { TaggableDisplay } from '@renderer/common/TaggableDisplay'
import { forwardRef } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'
import { BOX_WIDTH } from '../TaggableDisplay/TaggableDisplay'
import { useDirectories } from '@renderer/EntityProviders/DirectoryProvider'
import { CommonTaggableGridProps } from './TaggableGrid'

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

  return (
    <VirtuosoGrid
      data={taggables}
      totalCount={taggables.length}
      components={gridComponents}
      computeItemKey={(index, item) => item.id}
      itemContent={(index, f) => (
        <Box
          onContextMenu={(e) => {
            onRightClick && onRightClick(f, e)
          }}
          onClick={(e) => onSelect && onSelect(f, e.ctrlKey, e.shiftKey)}
          onDoubleClick={() => onDoubleClick && onDoubleClick(f)}
        >
          <TaggableDisplay taggable={f} isSelected={selection?.some((s) => s.id === f.id)} />
        </Box>
      )}
    />
    // <Grid container spacing={1}>
    //   {taggables?.map((f) => (
    //     <Grid item key={f.id} xs={true}>
    //       <TaggableDisplay
    //         taggable={f}
    //         isSelected={selection?.some((s) => s.id === f.id)}
    //         onClick={({ ctrl, shift }) => onSelect && onSelect(f, ctrl, shift)}
    //         onRightClick={(e) => onRightClick && onRightClick(f, e)}
    //       />
    //     </Grid>
    //   ))}
    // </Grid>
  )
}
