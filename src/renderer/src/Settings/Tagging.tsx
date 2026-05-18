import { Box, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import { ToggleSetting } from './ToggleSetting'
import { useSetting } from '@renderer/Common/Contexts/SettingsProvider'

export interface TaggingProps {}

export function Tagging({}: TaggingProps) {
  const { setting, updateSetting } = useSetting('taggableTagOrder')

  return (
    <Box>
      <Stack mt={1} mb={2} direction="row" gap={2} alignItems="center">
        <Typography variant="h3">Tagging</Typography>
      </Stack>
      <Stack gap={4}>
        <ToggleSetting
          storeKey="applyTagsOnSourceAssociation"
          title="Apply source tags to image on association"
          subtitle={
            'Copies all tags from the source file to the image file upon association. Only occurs if the image has no tags.'
          }
        />
        <Box flex={1} ml={10}>
          <Typography fontWeight="bold">Displayed order of tags on a specific file</Typography>
          <Typography variant="body2">
            Determines what order the tags will show up on the little popup panel when editing tags
            on a specific file.
          </Typography>
          <RadioGroup
            value={setting}
            row
            sx={{ mt: 1, gap: 2 }}
            onChange={(e) =>
              updateSetting(e.target.value as Impart.ConfigItems['taggableTagOrder'])
            }
          >
            <FormControlLabel
              value={'applied'}
              control={<Radio />}
              label={
                <Stack>
                  <Typography>
                    Order applied{' '}
                    <Typography variant="caption" lineHeight={1}>
                      (default)
                    </Typography>
                  </Typography>
                  <Typography variant="caption" lineHeight={1}>
                    Show tags in the order they were originally applied
                  </Typography>
                </Stack>
              }
            />
            <FormControlLabel
              value="sideBar"
              control={<Radio />}
              label={
                <Stack>
                  <Typography>Sidebar order</Typography>
                  <Typography variant="caption" lineHeight={1}>
                    Order tags according to how they're ordered in the tag selector
                  </Typography>
                </Stack>
              }
            />
            <FormControlLabel
              value="alphabetical"
              control={<Radio />}
              label={
                <Stack>
                  <Typography>Alphabetical order</Typography>
                  <Typography variant="caption" lineHeight={1}>
                    Self-explanatory, I just wanted all three options to have descriptions lol
                  </Typography>
                </Stack>
              }
            />
          </RadioGroup>
        </Box>
      </Stack>
    </Box>
  )
}
