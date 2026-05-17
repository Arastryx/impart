import { useDraggable } from '@dnd-kit/core'
import { Box } from '@mui/material'
import React, { useId } from 'react'
import { DraggableHandleProvider } from './DraggableHandleProvider'
import { useDisableDragging } from './DisableDragging'

export type DraggableType = 'taggable' | 'tag' | 'tagGroup'

export interface DraggableData {
  type: DraggableType | DraggableType[]
  id: number
}

export interface DraggableProps {
  children: React.ReactNode
  id: number
  type: DraggableType | DraggableType[]
  disabled?: boolean
  exposeHandle?: boolean
}

export function Draggable({ children, id, type, exposeHandle, disabled }: DraggableProps) {
  const draggableId = useId()

  const actualDisabled = disabled || useDisableDragging()?.disable

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draggableId,
    data: {
      id,
      type
    } satisfies DraggableData,
    disabled: actualDisabled
  })

  if (!exposeHandle) {
    return (
      <Box
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        sx={{ visibility: isDragging ? 'hidden' : undefined, outline: 'none' }}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box ref={setNodeRef} sx={{ visibility: isDragging ? 'hidden' : undefined, outline: 'none' }}>
      <DraggableHandleProvider listeners={listeners} attributes={attributes}>
        {children}
      </DraggableHandleProvider>
    </Box>
  )
}
