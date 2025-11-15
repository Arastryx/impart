import { Paper, Stack, TextField, IconButton, useTheme, Fade, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { HexColorPicker } from 'react-colorful'
import { useHotkeys } from 'react-hotkeys-hook'

export interface TagEditorProps {
  tag: Impart.Tag
  show?: boolean
  onEdit?: () => void
  onClose?: () => void
}

export function TagEditor({ tag, show, onEdit, onClose }: TagEditorProps) {
  const theme = useTheme()
  const [internalLabel, setInternalLabel] = useState(tag.label ?? '')
  const [internalColor, setInternalColor] = useState(tag.color ?? theme.palette.primary.main)

  const edit = async () => {
    await window.tagApi.editTag(tag.id, {
      isNsfw: tag.isNsfw,
      color: internalColor,
      label: internalLabel
    })
    onEdit && onEdit()
    onClose && onClose()
  }

  useEffect(() => {
    setInternalLabel(tag.label ?? '')
    setInternalColor(tag.color ?? theme.palette.primary.main)
  }, [tag, show])

  useHotkeys('Escape', () => onClose && onClose())

  return (
    <>
      {show && (
        <Paper sx={{ bgcolor: internalColor, borderRadius: 5 }}>
          <Stack px={0.5} py={0.5} direction="row" gap={0.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Tag Name"
              value={internalLabel}
              autoFocus
              onChange={(e) => setInternalLabel(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  edit()
                }
                if (e.key === 'Escape') {
                  onClose && onClose
                }
              }}
              sx={{ width: internalLabel == '' ? 90 : internalLabel.length * 5.5 + 38 }}
              slotProps={{
                input: {
                  sx: {
                    borderRadius: 4,
                    bgcolor: 'rgb(255 255 255 / 50%)',
                    fontSize: 12,
                    height: '1.7em'
                  }
                }
              }}
            />
            <IconButton
              size="small"
              sx={{ width: 18, height: 18, color: theme.palette.getContrastText(internalColor) }}
              onClick={edit}
            >
              <CheckIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Paper>
      )}

      <Fade in={show} unmountOnExit>
        <Box
          position="absolute"
          mt={1}
          left={0}
          zIndex={1}
          sx={{
            '& .react-colorful': {
              width: 150,
              height: 160
            }
          }}
        >
          <HexColorPicker color={internalColor} onChange={setInternalColor} />
        </Box>
      </Fade>
    </>
  )
}
