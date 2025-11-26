import { Box, BoxProps, Grid, IconButton, Stack, styled } from '@mui/material'
import { group } from 'console'
import React from 'react'
import { Draggable } from '../DragAndDrop'
import { Droppable } from '../DragAndDrop/Droppable'
import { satisfiesFilter } from './satisfiesFilter'
import AddIcon from '@mui/icons-material/Add'
import { Tag } from '../Tag'
import { CenteredOverlay } from '../CenteredOverlay'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

const DropIndicator = styled(Box, { shouldForwardProp: (prop) => prop !== 'showIndicator' })<
  BoxProps & { showIndicator: boolean }
>(({ showIndicator, theme }) =>
  showIndicator
    ? {
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        marginLeft: '-6px',
        paddingLeft: '3px'
      }
    : {}
)

export interface GroupTagListProps {
  groupId: number
  tags?: Impart.Tag[]
  selectedTags?: Impart.Tag[]
  excludedTags?: Impart.Tag[]
  filter?: string
  onAdd?: () => void
  onSelect?: (t: Impart.Tag) => void
  onExclude?: (t: Impart.Tag) => void
}

export function GroupTagList({
  groupId,
  tags,
  onAdd,
  onSelect,
  selectedTags,
  excludedTags,
  onExclude,
  filter
}: GroupTagListProps) {
  const {
    fetchOptions: { allowPrivate }
  } = useTaggables()

  return (
    <Grid container py={1} spacing={2}>
      {tags
        ?.slice()
        .filter((t) => satisfiesFilter(t, filter))
        .filter((t) => allowPrivate || !t.isPrivate)
        .sort((a, b) => a.tagOrder - b.tagOrder)
        .map((t) => (
          <Grid key={t.id}>
            <Droppable
              type="tag"
              id={t.id}
              hideIndicator
              render={({ overType }) => (
                <DropIndicator showIndicator={overType === 'tag'}>
                  <Draggable id={t.id} type="tag">
                    <Tag
                      tag={t}
                      editable
                      selected={selectedTags?.some((s) => s.id === t.id)}
                      excluded={excludedTags?.some((s) => s.id === t.id)}
                      onSelect={() => onSelect && onSelect(t)}
                      onExclude={() => onExclude && onExclude(t)}
                    />
                  </Draggable>
                </DropIndicator>
              )}
            />
          </Grid>
        ))}
      <Grid>
        <Droppable
          type="tagGroupEnd"
          id={groupId}
          hideIndicator
          render={({ overType }) => (
            <DropIndicator showIndicator={overType === 'tag'}>
              <IconButton
                size="small"
                onClick={async () => {
                  await window.tagApi.createTag(groupId)
                  onAdd && onAdd()
                }}
                className="fade-in-button"
              >
                <AddIcon />
              </IconButton>
            </DropIndicator>
          )}
        />
      </Grid>
    </Grid>
  )
}
