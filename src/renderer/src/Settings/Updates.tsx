import { Box, Button, Stack, Typography } from '@mui/material'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { ToggleSetting } from './ToggleSetting'

export interface UpdatesProps {
  onShowPatchNotes?: () => void
}

export function Updates({ onShowPatchNotes }: UpdatesProps) {
  return (
    <Box>
      <Stack mt={1} mb={2} direction="row" gap={2} alignItems="center">
        <Typography variant="h3">Updates</Typography>
        <Button
          onClick={onShowPatchNotes}
          variant="outlined"
          startIcon={<FormatListBulletedIcon />}
        >
          Show Patch Notes
        </Button>
      </Stack>
      <ToggleSetting
        storeKey="autoUpdatingEnabled"
        title="Enable Auto Updating"
        subtitle={
          <>
            Auto-updating takes place whenever the app starts up. If disabled, updates can always be
            installed the conventional way (downloading them from{' '}
            <a href="https://arastryx.itch.io/impart" target="_blank">
              Itch.io
            </a>{' '}
            or{' '}
            <a href="https://github.com/Arastryx/impart/releases" target="_blank">
              GitHub
            </a>
            ).{' '}
            <Typography variant="caption" component="span" color="primary.light">
              TODO: Implement fancy "Check For Updates" button and so on
            </Typography>
          </>
        }
      />
    </Box>
  )
}
