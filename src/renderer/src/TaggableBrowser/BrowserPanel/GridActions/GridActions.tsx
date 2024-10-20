import {
  Tooltip,
  ToggleButton,
  Stack,
  IconButton,
  styled,
  Box,
  Divider,
  Collapse,
  Breadcrumbs,
  Link,
  Chip,
  emphasize
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { YearSelector } from './YearSelector'
import { StyledToggleButtonGroup } from './StyledToggleButtonGroup'
import { SortButtons } from './SortButtons'
import { SearchBar } from '../../../Common/Components/SearchBar'
import HomeIcon from '@mui/icons-material/Home'
import { Droppable } from '@renderer/Common/Components/DragAndDrop/Droppable'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'

const ToolbarIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: 7
}))

export interface GridActionsProps {
  stack: Impart.TaggableStack[]
  onStackChange: (stack: Impart.TaggableStack[]) => void
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = theme.palette.secondary.light
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.primary.dark,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06)
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12)
    },
    '& .MuiChip-icon': {
      color: theme.palette.primary.dark
    }
  }
}) as typeof Chip // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

export function GridActions({ stack, onStackChange }: GridActionsProps) {
  const {
    fetchOptions: { search },
    setFetchOptions
  } = useTaggables()

  return (
    <Box width="100%">
      <Stack
        flex={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
        divider={<Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />}
      >
        <Box flex={1}>
          <SearchBar value={search} onChange={(v) => setFetchOptions({ search: v })} />
        </Box>
        <YearSelector />
        <SortButtons />
      </Stack>
      <Collapse in={stack.length > 0}>
        <Box pt={1}>
          <Breadcrumbs>
            <Droppable
              type="home"
              id={-1}
              render={() => (
                <StyledBreadcrumb
                  label="Home"
                  icon={<HomeIcon />}
                  onClick={() => onStackChange([])}
                />
              )}
            />
            {stack.map((s, index) => (
              <Droppable
                type="stack"
                id={s.id}
                render={() => (
                  <StyledBreadcrumb
                    key={s.id}
                    label={s.name}
                    onClick={() => onStackChange(stack.slice(0, index + 1))}
                  />
                )}
              />
            ))}
          </Breadcrumbs>
        </Box>
      </Collapse>
    </Box>
  )
}
