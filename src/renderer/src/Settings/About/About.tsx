import { Box, Card, CardContent, Stack, styled, Typography } from '@mui/material'
import React from 'react'
import arastryxIcon from './arastryxIcon.jpg'
import XIcon from '@mui/icons-material/X'
import bsky from './blueskyLogo.png'
import GithubIcon from '@mui/icons-material/GitHub'

const HoverLink = styled('a')({
  transition: '0.2s',
  opacity: 0.5,
  '&:hover': {
    opacity: 0.8
  }
})

export interface AboutProps {}

export function About({}: AboutProps) {
  return (
    <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
      <Card variant="outlined" sx={{ bgcolor: '#fff' }}>
        <CardContent sx={{ position: 'relative' }}>
          <Stack direction="row" gap={2}>
            <Box component="img" src={arastryxIcon} width={360} height={360} borderRadius={1000} />
            <Stack justifyContent="space-evenly">
              <Box>
                <Typography variant="h3" color="primary" lineHeight={0.7}>
                  Impart
                </Typography>
                <Box pb={0.5}>
                  <Typography fontSize={20}>v{import.meta.env.PACKAGE_VERSION}</Typography>
                </Box>
                <Box>
                  <Typography fontSize={14}>Contribute on GitHub!</Typography>
                  <HoverLink href="https://github.com/Arastryx/impart" target="_blank">
                    <GithubIcon sx={{ fontSize: 40, color: '#1F2328' }} />
                  </HoverLink>
                </Box>
              </Box>

              <Box>
                <Typography>Created by</Typography>
                <Typography variant="h4" color="info" lineHeight={0.7}>
                  Arastryx
                </Typography>
                <Stack pt={1} direction="row" gap={1}>
                  <HoverLink href="https://bsky.app/profile/arastryx.bsky.social" target="_blank">
                    <Box component="img" src={bsky} height={40} />
                  </HoverLink>
                  <HoverLink href="https://x.com/arastryx" target="_blank">
                    <XIcon sx={{ color: '#000', fontSize: 40 }} />
                  </HoverLink>
                  <Box width={75} pt={0.25} textAlign="center">
                    <Typography color="text.secondary" fontSize={12} sx={{ opacity: 0.9 }}>
                      Personal site coming soon!
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Stack>
          <Box position="absolute" bottom={0} right={2}>
            <Typography color="text.secondary" fontSize={12} sx={{ opacity: 0.7 }}>
              Better "About" page also soon!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}
