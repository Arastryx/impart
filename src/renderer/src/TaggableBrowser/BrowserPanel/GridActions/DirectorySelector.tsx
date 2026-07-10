import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select
} from '@mui/material'
import { useDirectories } from '@renderer/EntityProviders/DirectoryProvider'
import { useTaggables } from '@renderer/EntityProviders/TaggableProvider'
import CheckIcon from '@mui/icons-material/CheckBoxRounded'
import UncheckIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded'

export interface DirectorySelectorProps {}

const LABEL_ID = 'directory-selector-label'

export function DirectorySelector({}: DirectorySelectorProps) {
  const { data: directories } = useDirectories()
  const { fetchOptions, setFetchOptions } = useTaggables()

  return (
    <FormControl size="small" sx={{ width: '100%' }}>
      <InputLabel id={LABEL_ID}>Directories</InputLabel>
      <Select
        labelId={LABEL_ID}
        multiple
        value={fetchOptions.directories ?? []}
        onChange={(e) =>
          setFetchOptions({ directories: typeof e.target.value === 'string' ? [] : e.target.value })
        }
        input={<OutlinedInput label="Directories" />}
        renderValue={(selected) =>
          selected.length === 1 ? selected[0] : `${selected.length} Directories`
        }
      >
        {directories?.map((d) => (
          <MenuItem key={d.path} value={d.path}>
            <ListItemIcon>
              {fetchOptions.directories?.includes(d.path) ? <CheckIcon /> : <UncheckIcon />}
            </ListItemIcon>
            <ListItemText primary={d.path} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
