import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { Backable } from './Common/Components/Backable'
import { VirtualTaggableGrid } from './Common/Components/TaggableGrid'
import CheckIcon from '@mui/icons-material/CheckRounded'
import { useImpartIpcCall, useImpartIpcData } from './Common/Hooks/useImpartIpc'
import { ImageDisplay } from './Common/Components/TaggableDisplay/ImageDisplay'
import { TaggableDisplay } from './Common/Components/TaggableDisplay'
import { isTaggableFile } from './Common/taggable'
import { SearchBar } from './Common/Components/SearchBar'

export interface AssociateWithSourceProps {
  items: Impart.TaggableImage[]
  onFinish?: () => void
}

export function AssociateWithSource({ items, onFinish }: AssociateWithSourceProps) {
  const [search, setSearch] = useState<string>()
  const [selectedFile, setSelectedFile] = useState<Impart.TaggableFile>()
  const { data: files } = useImpartIpcData(
    () => window.taggableApi.getTaggables({ onlyFiles: true, order: 'alpha', search }),
    [search]
  )

  const { callIpc: associateImages, isLoading } = useImpartIpcCall(
    window.taggableApi.associateImageWithFile,
    []
  )

  return (
    <Backable onBack={onFinish}>
      <Stack direction="row" p={1} gap={1} height="100%">
        <Stack flex={1} gap={2}>
          <Typography variant="h2" textAlign="center">
            Associate With Source Files
          </Typography>
          <Card>
            <CardActions>
              <SearchBar value={search} onChange={setSearch} />
            </CardActions>
          </Card>
          <Stack flex={1} justifyContent="center" gap={2}>
            <VirtualTaggableGrid
              taggables={files}
              onClick={(e, item) => isTaggableFile(item) && setSelectedFile(item)}
            />
          </Stack>
        </Stack>
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <Stack gap={3} height="100%">
                <Typography fontSize={32}>Associate the following images:</Typography>
                <Stack gap={1} flex={1} overflow="auto">
                  {items.map((i) => (
                    <Stack key={i.id} direction="row" alignItems="center" gap={2}>
                      <Box
                        component="img"
                        src={`thum:///${i.id}/${i.dateModified.getTime()}`}
                        alt={i.fileIndex.fileName}
                        sx={{ maxHeight: 64, maxWidth: 100, borderRadius: 1, boxShadow: 2 }}
                      />
                      <Typography>{i.fileIndex.fileName}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack>
                  <Typography fontSize={32}>With the following file:</Typography>
                  {selectedFile && <TaggableDisplay taggable={selectedFile} />}
                  {!selectedFile && (
                    <Typography fontStyle="italic" color="text.secondary">
                      No file selected
                    </Typography>
                  )}
                </Stack>
                {!isLoading && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    disabled={selectedFile == null}
                    onClick={async () => {
                      await associateImages(
                        items.map((t) => t.id),
                        selectedFile!.id
                      )
                      onFinish && onFinish()
                    }}
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
