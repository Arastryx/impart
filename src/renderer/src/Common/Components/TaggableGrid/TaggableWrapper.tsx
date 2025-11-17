import { alpha, Box, lighten, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Draggable } from '../DragAndDrop'
import { Droppable, DroppableType } from '../DragAndDrop/Droppable'
import { TaggableDisplay } from '../TaggableDisplay'
import { isTaggableStack, isTaggableFile } from '@renderer/Common/taggable'
import { CenteredOverlay } from '../CenteredOverlay'
import SellIcon from '@mui/icons-material/SellRounded'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotosRounded'
import { DropIndicator } from '../TagSelector/DropIndicator'

function buildDropType(taggable: Impart.Taggable): DroppableType | DroppableType[] {
  if (isTaggableStack(taggable)) {
    return ['taggable', 'stack']
  } else if (isTaggableFile(taggable)) {
    return ['taggable', 'file']
  }

  return 'taggable'
}

export interface TaggableWrapperProps {
  taggable: Impart.Taggable
  dragAndDrop?: boolean
  selection?: Impart.Taggable[]
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onRightClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: Impart.Taggable) => void
  onDoubleClick?: (item: Impart.Taggable) => void
}

export function TaggableWrapper({
  taggable,
  selection,
  onMouseDown,
  onClick,
  onDoubleClick,
  onRightClick,
  dragAndDrop
}: TaggableWrapperProps) {
  //Instead of using true/false to render the tagging animation, we
  // use an increment which allows for sequential tag drops to unmount
  // and remount the tag animation, resetting it for each tag dropped
  const [tagIncrement, setTagIncrement] = useState(0)
  const [lastTagIncrement, setLastTagIncrement] = useState(0)

  useEffect(() => {
    setLastTagIncrement(tagIncrement)
  }, [tagIncrement])

  return (
    <CenteredOverlay
      overlay={
        <Box className="animate__animated animate__bounceIn">
          <Box className="animate__animated animate__delay-2s animate__fadeOut">
            <Stack
              bgcolor="background.paper"
              width={60}
              height={60}
              borderRadius={50}
              justifyContent="center"
              alignItems="center"
              pt={0.5}
              pl={0.5}
            >
              <SellIcon color="primary" sx={{ fontSize: 56 }} />
            </Stack>
          </Box>
        </Box>
      }
      show={tagIncrement > 0 && tagIncrement === lastTagIncrement}
      onHide={() => {
        setTagIncrement(0)
        setLastTagIncrement(0)
      }}
      autoHideDelay={3000}
    >
      <Droppable
        type={buildDropType(taggable)}
        id={taggable.id}
        disabled={!dragAndDrop}
        onDrop={(d) =>
          d.type === 'tag' &&
          !taggable.tags.some((t) => t.id === d.id) &&
          setTagIncrement(tagIncrement + 1)
        }
        render={({ overType, overId }) => (
          <CenteredOverlay
            show={overType === 'tag' && !taggable.tags.some((t) => t.id == overId)}
            overlay={
              <Stack
                bgcolor="background.paper"
                width={60}
                height={60}
                borderRadius={50}
                justifyContent="center"
                alignItems="center"
              >
                <AddToPhotosIcon color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            }
          >
            <Draggable id={taggable.id} type="taggable" disabled={!dragAndDrop}>
              <DropIndicator
                show={overType === 'tag' && !taggable.tags.some((t) => t.id == overId)}
                onContextMenu={(e) => {
                  onRightClick && onRightClick(e, taggable)
                }}
                onMouseDown={(e) => onMouseDown && onMouseDown(e, taggable)}
                onClick={(e) => onClick && onClick(e, taggable)}
                onDoubleClick={() => onDoubleClick && onDoubleClick(taggable)}
              >
                <TaggableDisplay
                  taggable={taggable}
                  isSelected={selection?.some((s) => s.id === taggable.id)}
                  showTags={overType === 'tag'}
                />
              </DropIndicator>
            </Draggable>
          </CenteredOverlay>
        )}
      ></Droppable>
    </CenteredOverlay>
  )
}
