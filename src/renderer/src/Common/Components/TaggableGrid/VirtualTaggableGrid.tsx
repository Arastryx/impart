import { darken, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import { GridComponents, VirtuosoGrid } from 'react-virtuoso'
import { BOX_HEIGHT, BOX_WIDTH } from '../TaggableDisplay/TaggableDisplay'
import { useEditTaggable } from '@renderer/TaggableBrowser/EditTaggableProvider'
import { useScrollLock } from '../../Hooks/useScrollLock'
import { TaggableWrapper, TaggableWrapperProps } from './TaggableWrapper'
import { useRandomEmptyImage } from './useRandomEmptyImage'

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

export interface VirtualTaggableGridProps extends Omit<TaggableWrapperProps, 'taggable'> {
  taggables?: Impart.Taggable[]
}

export function VirtualTaggableGrid({ taggables, ...wrapperProps }: VirtualTaggableGridProps) {
  const emptyImage = useRandomEmptyImage(taggables?.length ?? 0)

  const editState = useEditTaggable()
  const handleScroll = useScrollLock(editState && editState.editTarget != null)

  const [startingUp, setStartingUp] = useState(true)

  useEffect(() => {
    if (startingUp) {
      const timer = setTimeout(() => setStartingUp(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [startingUp])

  useEffect(() => {
    if ((taggables?.length ?? 0) > 0) {
      setStartingUp(false)
    }
  }, [taggables])

  if (!taggables || startingUp) {
    return (
      <Grid container p={2} spacing={2}>
        {Array.from(Array(40).keys()).map((_, index) => (
          <Grid key={index} minWidth={BOX_WIDTH} size={{ xs: 'grow' }}>
            <Skeleton
              width={BOX_WIDTH}
              height={BOX_HEIGHT}
              sx={(theme) => ({
                bgcolor: darken(theme.palette.background.default, 0.1)
              })}
              variant="rectangular"
              animation="pulse"
            />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (taggables.length === 0) {
    return (
      <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
        <img src={emptyImage} height={400} />
        <Typography color="primary.main" fontSize={36}>
          No Items Found
        </Typography>
      </Stack>
    )
  }

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
