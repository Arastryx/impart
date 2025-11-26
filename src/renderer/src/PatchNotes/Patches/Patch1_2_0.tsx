import { Box, Stack, Tooltip, Typography } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import paintingTux from './PaintingTux.png'
import privateArt from './Private.png'
import React from 'react'

export interface Patch1_2_0Props {}

export function Patch1_2_0({}: Patch1_2_0Props) {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        v1.2.0
      </Typography>
      <Typography variant="h4" gutterBottom>
        Main Features
      </Typography>
      <Stack direction={{ md: 'row', xs: 'column' }} gap={3} mb={3}>
        <Box flex={1}>
          <Stack width="100%" alignItems="center" mb={2}>
            <Box
              component="img"
              src={paintingTux}
              width="100%"
              maxWidth={600}
              bgcolor={'secondary.light'}
              borderRadius={5}
            />
          </Stack>
          <Typography variant="h5" gutterBottom>
            Linux Support!
          </Typography>
          <Typography>
            To celebrate its one year anniversary, Impart has been ported to Linux! By virtue of
            being built in electron, the Linux version of Impart is feature complete, and will
            receive updates alongside the windows version{' '}
            <Typography variant="caption" component="span">
              (Thanks to @the-furry-hubofeverything)
            </Typography>
          </Typography>
        </Box>
        <Box flex={1}>
          <Stack width="100%" alignItems="center" mb={2}>
            <Box
              component="img"
              src={privateArt}
              width="100%"
              maxWidth={600}
              bgcolor={'secondary.light'}
              borderRadius={5}
            />
          </Stack>

          <Typography variant="h5" gutterBottom>
            Private Tags
          </Typography>
          <Typography>
            Want to show someone something in Impart, but afraid you might expose{' '}
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">
                    Deep and personally inner machinations may include but are not limited to:
                  </Typography>
                  <ul>
                    <Typography variant="caption" component="li">
                      Contemplative, emotional artwork
                    </Typography>
                    <Typography variant="caption" component="li">
                      Secrets which are not yet told
                    </Typography>
                    <Typography variant="caption" component="li">
                      500+ silly doodles of an extremely obscure character who was only in like two
                      episodes of that one show that no one realizes you have a massive crush on
                    </Typography>
                  </ul>
                </Box>
              }
            >
              <Typography component="span" sx={{ textDecoration: 'underline dotted' }}>
                your most deep and personal inner machinations
              </Typography>
            </Tooltip>
            ? Rejoice! You can now flag tags as "Private", which can be toggled on and off such that
            all private tags (and any art tagged with those tags) are hidden.
          </Typography>
        </Box>
      </Stack>
      <Typography variant="h4" gutterBottom>
        Other Stuff
      </Typography>
      <ul>
        <Typography component="li">
          Added in-app patch notes (which is how you're seeing this right now!)
        </Typography>
        <Typography component="li">
          Added the ability to disable auto-updating (in the settings under "Updates")
        </Typography>
        <Typography component="li">
          Added a Refresh (<RefreshIcon fontSize="inherit" sx={{ verticalAlign: 'middle' }} />)
          button which re-indexes all directories and loads any changed files
        </Typography>
        <Typography component="li">
          Added several additional "No Items Found" images{' '}
          <Typography variant="caption" component="span">
            (Thanks to @Zelevai for ideas!)
          </Typography>
        </Typography>
        <Typography component="li">Updated About page</Typography>

        <Typography variant="body2" component={'li'} sx={{ mt: 1 }}>
          Updated almost every single package internally; Electron, React, Vite, MUI, you name it!
        </Typography>
        <Typography variant="body2" component={'li'}>
          Fixed a bug where updating a directory's recursiveness didn't actually do anything
        </Typography>
        <Typography variant="body2" component={'li'}>
          Fixed reported file changes when updating directory settings ("This will add X files and
          remove X files") being slightly off
        </Typography>
        <Typography variant="body2" component={'li'}>
          Fixed the app becoming unresponsive when using the "Create Stack" button in the selection
          indicator (the little popup on the lower left corner of the screen)
        </Typography>
        <Typography variant="body2" component={'li'}>
          Fixed not being able to add a folder if its name "contained" another folder that was
          already indexed and is recursive (<code>/my folder</code> vs{' '}
          <code>/my folder but cooler</code>)
        </Typography>
        <Typography variant="body2" component={'li'}>
          The whole app now properly uses the correct fonts. IDK if there were any spots that used
          the wrong font, but if there were, they're gone now
        </Typography>
      </ul>
    </Box>
  )
}
