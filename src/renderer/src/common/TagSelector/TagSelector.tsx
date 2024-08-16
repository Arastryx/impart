import {
  Stack,
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
  Button,
  Chip,
  TextField
} from '@mui/material'
import { useTags } from '@renderer/TagProvider'
import AddIcon from '@mui/icons-material/Add'
import { useMultiSelection } from '../useMultiSelection'
import { useMemo } from 'react'
import { Tag } from '../Tag'
import SparkleIcon from '@mui/icons-material/AutoAwesome'

export interface TagSelectorProps {
  selection?: Impart.Tag[]
  onChange?: (selection: Impart.Tag[]) => void
}

export function TagSelector({ selection, onChange }: TagSelectorProps) {
  const { data: groups, isLoading } = useTags()
  const tags = useMemo(() => groups?.flatMap((g) => g.tags) ?? [], [groups])

  const { selectItem, itemIsSelected } = useMultiSelection(
    tags,
    selection ?? [],
    onChange,
    (a, b) => a.id === b.id,
    { toggleMode: true }
  )

  if (!isLoading && groups?.length === 0) {
    return (
      <Stack alignItems="center" gap={2} pt={5}>
        <Typography>No tag groups have been created yet!</Typography>
        <Button variant="contained" startIcon={<SparkleIcon />} color="success">
          Create New Group
        </Button>
      </Stack>
    )
  }

  return (
    <Stack gap={2}>
      {groups?.map((g) => (
        <Box
          key={g.id}
          sx={{
            '& .MuiIconButton-root': {
              opacity: 0,
              transition: '0.2s'
            },
            '&:hover .MuiIconButton-root': {
              opacity: 1
            }
          }}
        >
          <Typography variant="h5">{g.label}</Typography>
          <Divider />
          <Grid container py={1} spacing={2}>
            {g.tags.map((t) => (
              <Grid key={t.id} item>
                <Tag tag={t} onClick={() => selectItem(t)} selected={itemIsSelected(t)} />
              </Grid>
            ))}
            <Grid item>
              <IconButton size="small">
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Stack>
  )
}
