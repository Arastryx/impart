import { Stack, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMultiSelection } from '../../Hooks/useMultiSelection'
import { useCallback, useMemo } from 'react'
import SparkleIcon from '@mui/icons-material/AutoAwesome'
import { TagGroup } from './TagGroup'
import { useTagGroups } from '@renderer/EntityProviders/TagProvider'

export interface TagSelectorProps {
  selection?: Impart.Tag[]
  onChange?: (selection: Impart.Tag[]) => void
}

export function TagSelector({ selection, onChange }: TagSelectorProps) {
  const { groups, reload } = useTagGroups()
  const tags = useMemo(() => groups?.flatMap((g) => g.tags ?? []) ?? [], [groups])

  const { selectItem } = useMultiSelection(
    tags,
    selection ?? [],
    onChange,
    useCallback((a, b) => a.id === b.id, []),
    { toggleMode: true }
  )

  if (groups?.length === 0) {
    return (
      <Stack alignItems="center" gap={2} pt={5}>
        <Typography>No tag groups have been created yet!</Typography>
        <Button
          variant="contained"
          startIcon={<SparkleIcon />}
          color="success"
          onClick={async () => {
            await window.tagApi.createGroup()
            reload()
          }}
        >
          Create New Group
        </Button>
      </Stack>
    )
  }

  return (
    <Stack
      gap={2}
      height="100%"
      sx={{
        '& .MuiButton-root': {
          opacity: 0,
          transition: '0.2s'
        },
        '&:hover .MuiButton-root': {
          opacity: 1
        }
      }}
    >
      {groups?.map((g) => (
        <TagGroup key={g.id} group={g} selectedTags={selection} onSelect={selectItem} />
      ))}

      <Button
        onClick={async () => {
          await window.tagApi.createGroup()
          reload()
        }}
      >
        <AddIcon />
      </Button>
    </Stack>
  )
}
