import React, { useState } from 'react'
import { Backable } from './Common/Components/Backable'
import {
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress
} from '@mui/material'
import CheckIcon from '@mui/icons-material/CheckRounded'
import { TaggableDisplay } from './Common/Components/TaggableDisplay'
import { useImpartIpcCall } from './Common/Hooks/useImpartIpc'
import { useTaggables } from './EntityProviders/TaggableProvider'
import { isTaggableImage, isTaggableStack } from './Common/taggable'
import { VirtualTaggableGrid } from './Common/Components/TaggableGrid'

function getInitialName(items: Impart.Taggable[]) {
  const first = items[0]

  if (isTaggableStack(first)) {
    return first.name
  } else {
    //Break up the filename and re-render it without the last part (the extension)
    const segments = first.fileIndex.fileName.split('.')
    segments.pop()
    return segments.join('.')
  }
}

export interface CreateStackProps {
  items: Impart.Taggable[]
  onFinish?: () => void
}

export function CreateStack({ onFinish, items }: CreateStackProps) {
  const [coverImage, setCoverImage] = useState(items.find(isTaggableImage))
  const [name, setName] = useState(getInitialName(items))
  const {
    fetchOptions: { stackId }
  } = useTaggables()

  const { callIpc: save, isLoading } = useImpartIpcCall(
    () =>
      window.stackApi.create(
        name,
        items.map((t) => t.id),
        coverImage?.id ?? -1,
        stackId
      ),
    [name, items, coverImage]
  )

  const createStack = async () => {
    await save()
    onFinish && onFinish()
  }

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1}>
          <Typography variant="h2" textAlign="center">
            Create Stack
          </Typography>
          <Stack flex={1} justifyContent="center" gap={2}>
            <VirtualTaggableGrid
              taggables={items}
              onMouseDown={(e, item) => isTaggableImage(item) && setCoverImage(item)}
            />
          </Stack>
        </Stack>
        <Box width={500}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <Stack gap={4} height="100%">
                <TextField
                  label="Name"
                  value={name}
                  fullWidth
                  onChange={(e) => setName(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      createStack()
                    }
                  }}
                />
                <Box flex={1}>
                  <Typography fontSize={32}>Cover:</Typography>
                  {!coverImage && (
                    <Box textAlign="center">
                      <Typography>None Selected!</Typography>
                      <Typography variant="body2" fontStyle="italic" fontSize={12}>
                        Select an image to set it as the cover of this stack.
                      </Typography>
                    </Box>
                  )}
                  {coverImage && (
                    <Box onClick={() => setCoverImage(undefined)}>
                      <TaggableDisplay taggable={coverImage} />
                    </Box>
                  )}
                </Box>
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!name}
                    startIcon={<CheckIcon />}
                    onClick={createStack}
                  >
                    Save
                  </Button>
                )}
                {isLoading && <CircularProgress />}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Backable>
  )
}
