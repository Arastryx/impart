import { Paper, Stack, Typography, IconButton, ButtonGroup, Button, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/CancelRounded'
import BookmarksIcon from '@mui/icons-material/BookmarksRounded'
import SellIcon from '@mui/icons-material/SellRounded'
import BurstModeIcon from '@mui/icons-material/BurstModeRounded'

export interface SelectionIndicatorProps {
  count?: number
  onTag?: () => void
  onCreateStack?: () => void
  onClear?: () => void
}

export function SelectionIndicator({
  count,
  onTag,
  onCreateStack,
  onClear
}: SelectionIndicatorProps) {
  const [displayCount, setDisplayCount] = useState(count)

  useEffect(() => {
    if (count != 0) {
      setDisplayCount(count)
    }
  }, [count])

  return (
    <Paper
      elevation={8}
      sx={{
        opacity: 0.9,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Stack direction="row" py={0.5} pl={1} alignItems="center" gap={1}>
        <Typography variant="body2">
          {displayCount} item{displayCount != 1 ? 's' : ''} selected
        </Typography>
        <Stack direction="row">
          <Tooltip title={displayCount == 1 ? 'Edit Tags' : 'Bulk Tag'} placement="top">
            <IconButton onClick={onTag}>
              {displayCount == 1 && <SellIcon />}
              {displayCount != 1 && <BookmarksIcon />}
            </IconButton>
          </Tooltip>
          {displayCount != 1 && (
            <Tooltip title="Create Stack" placement="top">
              <IconButton onClick={onCreateStack}>
                <BurstModeIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        <Tooltip title="Clear Selection" placement="top">
          <IconButton size="small" color="error" onClick={onClear}>
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  )
}
