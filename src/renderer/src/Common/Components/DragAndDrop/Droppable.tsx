import { useDroppable } from '@dnd-kit/core'
import { Box } from '@mui/material'
import React from 'react'
import { DraggableType } from './Draggable'
import { useImpartDragAndDrop } from './ImpartDragAndDropProvider'

export type DroppableType = 'taggable' | 'stack' | 'home'

export interface DroppableData {
  type: DroppableType | DroppableType[]
  id: number
}

export interface DroppableProps {
  type: DroppableType | DroppableType[]
  id: number
  render: (props: { overType?: DraggableType }) => React.ReactNode
}

export function Droppable({ type, id, render }: DroppableProps) {
  const { setNodeRef, active, isOver } = useDroppable({
    id: `drop-${type}-${id}`,
    data: {
      type,
      id
    } satisfies DroppableData
  })

  const { isValidDrop } = useImpartDragAndDrop()
  const overType: DraggableType | undefined = active?.data.current?.type

  const canDrop = isOver && overType && isValidDrop(overType, type)

  return <Box ref={setNodeRef}>{render({ overType: canDrop ? overType : undefined })}</Box>
}
