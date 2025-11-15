import { Box, Paper, Stack, Typography } from '@mui/material'
import { ImageDisplay } from './ImageDisplay'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileRounded'
import { useRef } from 'react'
import BurstModeIcon from '@mui/icons-material/BurstModeRounded'
import { PaperStack } from './PaperStack'
import { useEditTaggable } from '@renderer/TaggableBrowser/EditTaggableProvider'
import { BetterPopper } from '../BetterPopper'
import { EditTags } from './EditTags'
import { RenameStack } from './RenameStack'
import { isTaggableFile, isTaggableImage, isTaggableStack } from '@renderer/common/taggable'

export const BOX_WIDTH = 220
export const BOX_HEIGHT = 190

export interface TaggableDisplayProps {
  taggable: Impart.Taggable
  isSelected?: boolean
  showTags?: boolean
}

export function TaggableDisplay({ taggable, isSelected, showTags }: TaggableDisplayProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const editState = useEditTaggable()

  return (
    <>
      <Stack
        ref={anchorRef}
        position="relative"
        alignItems="center"
        justifyContent="center"
        width={BOX_WIDTH + 20}
        height={BOX_HEIGHT + 40}
        p={1}
        borderRadius={2}
        onDoubleClick={() => !isTaggableStack(taggable) && window.fileApi.openFile(taggable.id)}
        sx={{
          userSelect: 'none',
          bgcolor: isSelected ? '#FFFFFF55' : undefined,
          '&:hover': {
            bgcolor: isSelected ? '#FFFFFF55' : '#FFFFFF33'
          },
          transition: 'opacity 0.2s',
          opacity:
            editState &&
            ((editState.editTarget && editState.editTarget.id != taggable.id) ||
              (editState.renameTarget && editState.renameTarget.id !== taggable.id))
              ? 0.5
              : 1
        }}
      >
        {isTaggableImage(taggable) && <ImageDisplay image={taggable} />}
        {isTaggableFile(taggable) && (
          <Stack width={BOX_WIDTH} px={2} alignItems="center" justifyContent="center">
            <InsertDriveFileIcon sx={{ fontSize: 120 }} />
          </Stack>
        )}
        {isTaggableStack(taggable) &&
          (taggable.cover ? (
            <PaperStack>
              <ImageDisplay image={taggable.cover} shrink />
            </PaperStack>
          ) : (
            <Stack width={BOX_WIDTH} px={2} alignItems="center" justifyContent="center">
              <BurstModeIcon sx={{ fontSize: 120 }} />
            </Stack>
          ))}
        <Box maxWidth={BOX_WIDTH} pt={0.25}>
          <Typography textAlign="center" variant="caption" sx={{ wordBreak: 'break-all' }}>
            {!isTaggableStack(taggable) && taggable.fileIndex.fileName}
            {isTaggableStack(taggable) && taggable.name}
          </Typography>
        </Box>
      </Stack>
      {editState !== false && (
        <BetterPopper
          open={
            editState.editTarget?.id === taggable.id || editState.renameTarget?.id === taggable.id
          }
          anchorEl={anchorRef.current}
        >
          <Paper elevation={8}>
            {editState.editTarget?.id === taggable.id && (
              <EditTags tags={editState.tags} removeTag={editState.removeTag} />
            )}

            {editState.renameTarget?.id === taggable.id && isTaggableStack(taggable) && (
              <RenameStack stack={taggable} />
            )}
          </Paper>
        </BetterPopper>
      )}
      {showTags && (
        <BetterPopper open={showTags} anchorEl={anchorRef.current}>
          <Paper elevation={8}>
            <EditTags tags={taggable.tags} />
          </Paper>
        </BetterPopper>
      )}
    </>
  )
}
