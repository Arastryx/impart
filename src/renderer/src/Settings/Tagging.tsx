import { Box, Stack, Typography } from '@mui/material'
import { ToggleSetting } from './ToggleSetting'

export interface TaggingProps {}

export function Tagging({}: TaggingProps) {
  return (
    <Box>
      <Stack mt={1} mb={2} direction="row" gap={2} alignItems="center">
        <Typography variant="h3">Tagging</Typography>
      </Stack>
      <ToggleSetting
        storeKey="applyTagsOnSourceAssociation"
        title="Apply source tags to image on association"
        subtitle={
          'Copies all tags from the source file to the image file upon association. Only occurs if the image has no tags.'
        }
      />
    </Box>
  )
}
