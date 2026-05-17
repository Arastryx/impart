import { Box, Typography, Divider, IconButton, Stack, darken, Collapse } from '@mui/material'
import { useState } from 'react'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import { EditTagGroup } from './EditTagGroup'
import { useConfirmationDialog } from '../ConfirmationDialogProvider'
import { useDraggableHandle } from '../DragAndDrop/DraggableHandleProvider'
import DragIndicatorIcon from '@mui/icons-material/DragIndicatorRounded'
import { useImpartIpcCall } from '@renderer/Common/Hooks/useImpartIpc'
import { GroupTagList } from './GroupTagList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useDisableDragging } from '../DragAndDrop/DisableDragging'

export interface TagGroupProps {
  group: Impart.TagGroup
  filter?: string
  selectedTags?: Impart.Tag[]
  excludedTags?: Impart.Tag[]
  onSelect?: (tag: Impart.Tag) => void
  onExclude?: (tag: Impart.Tag) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function TagGroup({
  group,
  filter,
  selectedTags,
  excludedTags,
  onSelect,
  onExclude,
  collapsed,
  onToggleCollapse
}: TagGroupProps) {
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
  const dragDisabled = useDisableDragging()

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
          {!dragDisabled?.disable && (
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
          )}

          <Box flex={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" onClick={() => setEditMode(true)}>
                {group.label ?? 'Unnamed Group'}
              </Typography>
              <Stack direction="row">
                <IconButton
                  className="fade-in-button"
                  color="error"
                  onClick={remove}
                  disabled={isDeleting}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={onToggleCollapse} size="small">
                  {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Stack>
            </Stack>
            <Divider />
          </Box>
        </Stack>
      )}

      <Collapse in={!collapsed}>
        <GroupTagList
          tags={group.tags}
          groupId={group.id}
          filter={filter}
          selectedTags={selectedTags}
          excludedTags={excludedTags}
          onSelect={onSelect}
          onExclude={onExclude}
          onAdd={reload}
        />
      </Collapse>
    </Box>
  )
}
