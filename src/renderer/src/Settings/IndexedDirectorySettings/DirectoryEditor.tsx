import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteRounded'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesomeRounded'
import { DeletedDirectory } from './DeletedDirectory'
import EmergencyIcon from '@mui/icons-material/EmergencyRounded'
import UndoIcon from '@mui/icons-material/UndoRounded'
import { TagMultiSelect } from './TagMultiSelect'
import HelpIcon from '@mui/icons-material/HelpRounded'

function isDifferent(first: Impart.Directory, second: Impart.Directory) {
  return (
    first.autoTags.slice().sort().join(',') !== second.autoTags.slice().sort().join(',') ||
    first.recursive !== second.recursive
  )
}

export interface DirectoryEditorProps {
  directoryState?: Impart.Directory
  originalDirectory?: Impart.Directory
  subDirectories?: Impart.Directory[]
  onChange?: (state: Partial<Impart.Directory>) => void
  onDelete?: () => void
  onRestore?: () => void
}

export function DirectoryEditor({
  directoryState,
  originalDirectory,
  subDirectories,
  onChange,
  onDelete,
  onRestore
}: DirectoryEditorProps) {
  if (directoryState == null) {
    return <DeletedDirectory directory={originalDirectory} onRestore={onRestore} />
  }

  const different = originalDirectory && isDifferent(directoryState, originalDirectory)

  return (
    <Card sx={{ bgcolor: '#fff' }}>
      <CardHeader
        title={
          <>
            {directoryState.path}{' '}
            {!originalDirectory && (
              <Tooltip title="Newly added directory">
                <AutoAwesomeIcon color="info" />
              </Tooltip>
            )}
            {different && (
              <Tooltip title="Modified">
                <EmergencyIcon color="info" />
              </Tooltip>
            )}
          </>
        }
        action={
          <>
            {different && (
              <IconButton onClick={onRestore}>
                <UndoIcon />
              </IconButton>
            )}
            <IconButton color="error" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        }
      />
      <CardContent>
        <Grid container spacing={4} alignItems="center">
          <Grid>
            <TagMultiSelect
              selection={directoryState.autoTags}
              onChange={(s) => onChange && onChange({ autoTags: s })}
            />
          </Grid>
          <Grid>
            <FormControlLabel
              control={
                <Switch
                  checked={directoryState.recursive}
                  disabled={subDirectories && subDirectories.length != 0}
                  onChange={(e, checked) => onChange && onChange({ recursive: checked })}
                />
              }
              label={
                <>
                  Recursive{' '}
                  {subDirectories && subDirectories.length != 0 && (
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="caption">
                            This directory cannot be made recursive because some of its
                            sub-directories are already indexed:
                          </Typography>
                          <ul>
                            {subDirectories.map((d) => (
                              <Typography key={d.path} component="li" variant="caption">
                                {d.path}
                              </Typography>
                            ))}
                          </ul>
                        </Box>
                      }
                    >
                      <HelpIcon sx={{ verticalAlign: 'text-bottom' }} />
                    </Tooltip>
                  )}
                </>
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
