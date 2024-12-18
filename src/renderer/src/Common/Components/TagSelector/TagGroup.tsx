import {
  Box,
  Typography,
  Divider,
  Grid2 as Grid,
  IconButton,
  Stack,
  darken,
  BoxProps,
  styled
} from '@mui/material'
import { useState } from 'react'
import { Tag } from '../Tag/Tag'
import AddIcon from '@mui/icons-material/AddRounded'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import { EditTagGroup } from './EditTagGroup'
import { Draggable } from '../DragAndDrop/Draggable'
import { useConfirmationDialog } from '../ConfirmationDialogProvider'
import { useDraggableHandle } from '../DragAndDrop/DraggableHandleProvider'
import DragIndicatorIcon from '@mui/icons-material/DragIndicatorRounded'
import { Droppable } from '../DragAndDrop/Droppable'
import { satisfiesFilter } from './satisfiesFilter'
import { useImpartIpcCall } from '@renderer/Common/Hooks/useImpartIpc'

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

export interface TagGroupProps {
  group: Impart.TagGroup
  filter?: string
  selectedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
}

export function TagGroup({ group, filter, selectedTags, onSelect }: TagGroupProps) {
  const [editMode, setEditMode] = useState(false)
  const { reload } = useTagGroups()

  const { callIpc: deleteGroup, isLoading: isDeleting } = useImpartIpcCall(
    () => window.tagApi.deleteGroup(group.id),
    [group.id]
  )

  const confirm = useConfirmationDialog()

  const remove = async () => {
    if ((group.tags?.length ?? 0) > 0) {
      confirm(
        {
          title: 'Remove Group?',
          body: `This will remove ${group.tags?.length} tags as well. This action cannot be reversed.`,
          danger: true,
          confirmText: 'Delete',
          confirmIcon: <DeleteIcon />
        },
        async () => {
          await deleteGroup()
          reload()
        }
      )
    } else {
      await deleteGroup()
      reload()
    }
  }

  const dragHandle = useDraggableHandle()

  return (
    <Box
      key={group.id}
      sx={{
        '& .fade-in-button': {
          opacity: 0,
          transition: '0.2s'
        },
        '&:hover .fade-in-button': {
          opacity: 1
        }
      }}
    >
      <EditTagGroup group={group} show={editMode} onClose={() => setEditMode(false)} />
      {!editMode && (
        <Stack direction="row" gap={1}>
          <Stack
            justifyContent="center"
            borderRadius={2}
            sx={(theme) => ({
              transition: '0.2s',
              '&:hover': { bgcolor: darken(theme.palette.background.paper, 0.1) }
            })}
            {...dragHandle}
          >
            <DragIndicatorIcon />
          </Stack>
          <Box flex={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" onClick={() => setEditMode(true)}>
                {group.label ?? 'Unnamed Group'}
              </Typography>
              <IconButton
                className="fade-in-button"
                color="error"
                onClick={remove}
                disabled={isDeleting}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Divider />
          </Box>
        </Stack>
      )}

      <Grid container py={1} spacing={2}>
        {group.tags
          ?.slice()
          .filter((t) => satisfiesFilter(t, filter))
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
                        onClick={() => onSelect && onSelect(t)}
                        selected={selectedTags?.some((s) => s.id === t.id)}
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
            id={group.id}
            hideIndicator
            render={({ overType }) => (
              <DropIndicator showIndicator={overType === 'tag'}>
                <IconButton
                  size="small"
                  onClick={async () => {
                    await window.tagApi.createTag(group.id)
                    reload()
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
    </Box>
  )
}
