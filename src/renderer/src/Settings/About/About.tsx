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

const InverseHoverLink = styled('a')({
  transition: '0.2s',
  '&:hover': {
    opacity: 0.75
  }
})

export interface AboutProps {}

export function About({}: AboutProps) {
  return (
    <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
      <Card variant="outlined" sx={{ bgcolor: '#fff' }}>
        <CardContent sx={{ position: 'relative', px: 3, py: 5 }}>
          <Stack direction="row" gap={2}>
            <InverseHoverLink href="https://storyteller.monster" target="_blank">
              <Box
                component="img"
                src={arastryxIcon}
                width={360}
                height={360}
                borderRadius={1000}
              />
            </InverseHoverLink>
            <Stack justifyContent="space-between">
              <Box>
                <Typography variant="h3" color="primary" lineHeight={0.7}>
                  Impart
                </Typography>
                <Box pb={0.5}>
                  <Typography fontSize={20}>v{import.meta.env.PACKAGE_VERSION}</Typography>
                </Box>
                <Box>
                  <Typography fontSize={14}>Contribute on GitHub!</Typography>
                  <Box textAlign={'center'}>
                    <HoverLink href="https://github.com/Arastryx/impart" target="_blank">
                      <GithubIcon sx={{ fontSize: 100, color: '#1F2328' }} />
                    </HoverLink>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ ml: 5 }}>Created by</Typography>
                <Box
                  component={InverseHoverLink}
                  href="https://storyteller.monster"
                  target="_blank"
                  sx={{ textDecoration: 'none' }}
                >
                  <Typography
                    variant="h2"
                    color="info.dark"
                    fontFamily="ZenOldMincho"
                    lineHeight={1}
                    mt={-3}
                  >
                    Arastryx
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
