import {
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import { useTaskStatus } from '@renderer/TaskStatusProvider'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useRef, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'

export interface TaskStatusProps {}

export function TaskStatus({}: TaskStatusProps) {
  const [showMenu, setShowMenu] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const { currentStep, taskCancelled, stepCount, taskType, currentTask, taskCount } =
    useTaskStatus()

  const getTaskLabel = () => {
    if (!taskType) {
      return taskCancelled ? 'Cancelled' : 'Finished!'
    }

    switch (taskType) {
      case 'bulkTag':
        return 'Bulk Tagging...'
      case 'indexing':
        return 'Indexing...'
      case 'sourceAssociation':
        return 'Associating images with source files...'
    }
  }

  return (
    <Box position="relative">
      <Stack gap={2} pt={1}>
        {!taskCancelled && (
          <Box>
            <Typography variant="body2">
              Step {Math.min(currentTask + 1, taskCount)}/{taskCount}
            </Typography>

            {taskCount != 0 && (
              <LinearProgress value={(currentTask / taskCount) * 100} variant="determinate" />
            )}
          </Box>
        )}
        <Box>
          <Typography variant="body2">{getTaskLabel()}</Typography>
          {stepCount != 0 && (
            <LinearProgress value={(currentStep / stepCount) * 100} variant="determinate" />
          )}
        </Box>
      </Stack>
      <Box position={'absolute'} top={-10} right={-10}>
        <IconButton size="small" onClick={() => setShowMenu(true)} ref={anchorRef}>
          <MoreVertIcon fontSize="inherit" />
        </IconButton>
      </Box>
      <Menu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        anchorEl={anchorRef.current}
        slotProps={{ list: { dense: true } }}
        sx={{ paddingX: '16px', '.MuiListItemIcon-root': { minWidth: '30px' } }}
      >
        <MenuItem
          onClick={() => {
            window.indexApi.cancelTasks()
            setShowMenu(false)
          }}
        >
          <ListItemIcon>
            <CancelIcon />
          </ListItemIcon>
          <ListItemText>Cancel Tasks</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

