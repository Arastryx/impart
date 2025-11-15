import { Box, Chip, ChipProps, useTheme } from '@mui/material'
import { useState } from 'react'
import { ContextMenu } from '../ContextMenu'
import EditIcon from '@mui/icons-material/EditRounded'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import { TagEditor } from './TagEditor'
import DoneIcon from '@mui/icons-material/Done'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import { CenteredOverlay } from '../CenteredOverlay'

export interface TagProps {
  tag: Impart.Tag
  editable?: boolean
  selected?: boolean
  excluded?: boolean
  size?: ChipProps['size']
  onSelect?: () => void
  onExclude?: () => void
}

export function Tag({ tag, selected, editable, onSelect, onExclude, size, excluded }: TagProps) {
  const [editMode, setEditMode] = useState(false)
  const theme = useTheme()

  const { reload } = useTagGroups()

  return (
    <Box position="relative">
      <TagEditor tag={tag} show={editMode} onEdit={reload} onClose={() => setEditMode(false)} />
      {!editMode && (
        <ContextMenu
          disabled={!editable}
          options={[
            {
              icon: selected ? <RemoveIcon /> : <DoneIcon />,
              label: selected ? 'Deselect' : 'Select',
              onClick: onSelect,
              bold: true,
              shortcut: 'Click'
            },
            {
              icon: excluded ? <RemoveIcon /> : <CloseIcon />,
              label: excluded ? 'Include' : 'Exclude',
              onClick: onExclude,
              shortcut: 'Alt + Click'
            },
            'divider',
            {
              icon: <EditIcon />,
              label: 'Edit...',
              onClick: () => setEditMode(true)
            },
            {
              label: 'Is NSFW',
              isChecked: tag.isNsfw,
              onClick: async () => {
                await window.tagApi.editTag(tag.id, {
                  color: tag.color,
                  label: tag.label,
                  isNsfw: !tag.isNsfw
                })

                reload()
              }
            },
            {
              icon: <DeleteIcon />,
              label: 'Delete',
              onClick: async () => {
                await window.tagApi.deleteTag(tag.id)
                reload()
              },
              danger: true
            }
          ]}
          render={({ open }) => (
            <CenteredOverlay
              overlay={
                <Box
                  width="calc(100% + 10px)"
                  height={3}
                  bgcolor={tag.color}
                  sx={{ opacity: excluded ? 0.6 : 0, transition: '0.2s' }}
                ></Box>
              }
              show={true}
            >
              <Chip
                onClick={(e) => (e.altKey ? onExclude?.() : onSelect?.())}
                size={size}
                label={tag.label ? tag.label : 'Unnamed Tag'}
                onContextMenu={open}
                sx={{
                  transition: 'opacity 0.2s',
                  opacity: excluded ? 0.5 : 1,
                  bgcolor: tag.color ?? 'primary.main',
                  color: theme.palette.getContrastText(tag.color ?? theme.palette.primary.main),
                  boxShadow: selected
                    ? `0px 0px 0px 2px ${theme.palette.secondary.light}, 0px 0px 0px 5px ${theme.palette.secondary.dark}`
                    : undefined,

                  '&:hover': {
                    opacity: excluded ? 0.4 : 0.8,
                    bgcolor: tag.color ?? 'primary.main',
                    color: theme.palette.getContrastText(tag.color ?? theme.palette.primary.main)
                  }
                }}
              />
            </CenteredOverlay>
          )}
        />
      )}
    </Box>
  )
}
