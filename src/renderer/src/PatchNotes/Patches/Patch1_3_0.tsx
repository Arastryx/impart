import { Box, Stack, Tooltip, Typography } from '@mui/material'
import excluded from './Excluded.png'
import HelpIcon from '@mui/icons-material/Help'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export interface Patch1_3_0Props {}

export function Patch1_3_0({}: Patch1_3_0Props) {
  return (
    <Box position="relative">
      <Stack
        direction={'row'}
        gap={2}
        position="absolute"
        top={0}
        right={0}
        alignItems={'flex-start'}
        ml={20}
      >
        <Typography maxWidth={430} textAlign={'right'}>
          Tired of seeing patch notes every time the app updates? You can disable them now here!
        </Typography>
        <ArrowUpwardIcon fontSize="large" />
      </Stack>
      <Typography variant="h3" gutterBottom>
        v1.3.0
      </Typography>
      <Typography variant="h4" gutterBottom>
        Features
      </Typography>
      <Stack direction={'row'} gap={2} alignItems={'center'}>
        <Box component="img" src={excluded} sx={{ borderRadius: 4, maxHeight: 181, ml: 5 }} />
        <Box>
          <Typography variant="h5" gutterBottom>
            Default Excluded Tags:
          </Typography>
          <Typography>
            You can now flag tags as "Excluded by Default". Tags that are excluded by default are
            automatically{' '}
            <Tooltip title="Excluding a tag causes all attached files to be hidden. An excluded tag can still be selected to view attached files, and it can also be 'included' (alt + click) to reveal attached files">
              <Typography component="span" sx={{ textDecoration: 'underline dotted' }}>
                excluded
                <HelpIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} />
              </Typography>
            </Tooltip>{' '}
            when launching the app and when clearing the tag selection. Useful if you have files
            which you'd like to track in Impart that you don't necessarily want to browse every time
            you open the app!
          </Typography>
        </Box>
      </Stack>
      <ul>
        <Typography component="li" sx={{ mt: 2 }}>
          When editing the tags on a file, tags are now ordered by their order in the side bar
          (instead of whatever order they were originally assigned in)
        </Typography>
        <ul>
          <Typography component="li">
            Alternatively, the tags may be ordered alphabetically, configurable via the new
            "Tagging" options screen
          </Typography>
        </ul>
        <Typography component="li">
          Added a new "Displayed Files" filter in the search bar filters{' '}
          <FilterAltIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} /> which lets you
          choose which type of files to display (image files only, non-image files only, etc)
        </Typography>
        <Typography component="li">
          Accidentally added the wrong directory to Impart? You can now halt file indexing via the
          little drop down menu <MoreVertIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} />{' '}
          on the indexing panel!
        </Typography>
        <Typography component="li">
          You can now detach a source file from an image file (from the right click menu on the
          image)
        </Typography>
        <Typography component="li">
          When a non-image file with tags gets associated with an image file, that image file now
          inherits those tags (can be disabled in the Tagging options)
        </Typography>
        <Typography component="li">
          You can now disable showing the patch notes on update
        </Typography>
        <ul>
          <Typography component="li">
            You can now also view the patch notes manually from the "Updates" options screen
          </Typography>
        </ul>
        <Typography component="li">
          Finally fixed a bug where tag selection would be ignored while the app was starting up
        </Typography>
        <Typography component="li">
          The app now has logs! They can be found at{' '}
          <code>[USER]/AppData/Roaming/impart/logs/main.log</code> on Windows and{' '}
          <code>[USER]/.config/impart/logs/main.log</code> on Linux
        </Typography>
        <Typography component="li">Added some additional empty results images!</Typography>
        <Typography variant="body2" component={'li'} sx={{ mt: 1 }}>
          Fixed an error being thrown when trying to delete a tag category that contains tags that
          are attached to files
        </Typography>
        <Typography variant="body2" component={'li'}>
          Fixed an edge case where dragging a tag while bulk tagging files would break the whole
          interface
        </Typography>
        <Typography variant="body2" component={'li'}>
          Uninstalling Impart now also properly clears out the app data on Windows
        </Typography>
        <Typography variant="body2" component={'li'}>
          Updated electron, typescript and a few other small packages
        </Typography>
      </ul>
    </Box>
  )
}
