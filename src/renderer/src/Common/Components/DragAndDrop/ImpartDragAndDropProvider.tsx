import {
  useSensor,
  MouseSensor,
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  pointerWithin,
  rectIntersection
} from '@dnd-kit/core'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import React, { useState } from 'react'
import { TaggableDisplay } from '../TaggableDisplay'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import { DraggableData, DraggableType } from './Draggable'
import { Tag } from '../Tag'
import { DroppableData, DroppableType } from './Droppable'
import { useDropEvents } from './useDropEvents'
import { createContext, useContext } from 'react'
import { Box } from '@mui/material'

function findTag(tagId: number, groups?: Impart.TagGroup[]) {
  for (const group of groups ?? []) {
    const tag = group.tags?.find((t) => t.id === tagId)

    if (tag) {
      return tag
    }
  }
}

export interface ImpartDragAndDropData {
  isValidDrop: (dragType: DraggableType, dropType: DroppableType | DroppableType[]) => boolean
}

const ImpartDragAndDropContext = createContext<ImpartDragAndDropData | null>(null)

export interface ImpartDragAndDropProviderProps {
  children?: React.ReactNode
}

export function ImpartDragAndDropProvider({ children }: ImpartDragAndDropProviderProps) {
  const [current, setCurrent] = useState<DraggableData>()
  const [successfulDrop, setSuccesfulDrop] = useState(false)

  const { handle, isValidDrop } = useDropEvents()

  const { taggables } = useTaggables()
  const { groups } = useTagGroups()

  const draggedTaggable = current?.type === 'taggable' && taggables.find((t) => t.id === current.id)
  const draggedTag = current?.type === 'tag' && findTag(current.id, groups)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  const handleDrag = (e: DragStartEvent) => {
    setCurrent(e.active.data.current as DraggableData)
    setSuccesfulDrop(false)
  }

  const handleDrop = (e: DragEndEvent) => {
    setCurrent(undefined)

    const draggable = e.active.data.current as DraggableData
    const droppable = e.over?.data.current as DroppableData | undefined

    if (droppable) {
      setSuccesfulDrop(handle(draggable, droppable))
    }
  }

  return (
    <ImpartDragAndDropContext.Provider value={{ isValidDrop }}>
      <DndContext
        sensors={[mouseSensor]}
        onDragStart={handleDrag}
        onDragEnd={handleDrop}
        collisionDetection={(args) => {
          // First, let's see if there are any collisions with the pointer
          const pointerCollisions = pointerWithin(args)

          // Collision detection algorithms return an array of collisions
          if (pointerCollisions.length > 0) {
            return pointerCollisions
          }

          // If there are no collisions with the pointer, return rectangle intersections
          return rectIntersection(args)
        }}
      >
        {children}
        <DragOverlay dropAnimation={successfulDrop ? null : undefined}>
          <Box sx={{ opacity: 0.8 }}>
            {draggedTaggable && <TaggableDisplay taggable={draggedTaggable} />}
            {draggedTag && <Tag tag={draggedTag} />}
          </Box>
        </DragOverlay>
      </DndContext>
    </ImpartDragAndDropContext.Provider>
  )
}

export function useImpartDragAndDrop() {
  const result = useContext(ImpartDragAndDropContext)

  if (!result) {
    throw new Error(
      'useImpartDragAndDrop() cannot be used without being wrapped by a ImpartDragAndDropProvider'
    )
  }

  return result
}
