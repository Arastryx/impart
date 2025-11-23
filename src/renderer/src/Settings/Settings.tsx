import { Box, Card, IconButton, Stack, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import FolderIcon from '@mui/icons-material/FolderRounded'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { IndexedDirectoriesSettings } from './IndexedDirectorySettings'
import { useTaskStatus } from '@renderer/TaskStatusProvider'
import HideImageIcon from '@mui/icons-material/HideImageRounded'
import { HiddenItems } from './HiddenItems'
import InfoIcon from '@mui/icons-material/InfoRounded'
import { About } from './About/About'
import { Updates } from './Updates'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'

type SettingsType = 'updates' | 'directories' | 'hiddenItems' | 'about'

export interface SettingsProps {
  onClose?: () => void
  onShowPatchNotes?: () => void
}

export function Settings({ onClose, onShowPatchNotes }: SettingsProps) {
  const [selectedTab, setSelectedTab] = useState<SettingsType>('directories')

  const { isTaskRunning } = useTaskStatus()

  const test = false

  return (
    <Stack height="100%" justifyContent="center">
      <Card sx={{ height: '100%', position: 'relative' }}>
        <Box position="absolute" top={5} right={20} zIndex={1}>
          <IconButton size="large" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box sx={{ height: '100%' }}>
          <Stack direction="row" gap={2} height={'100%'}>
            <Stack
              alignItems="flex-end"
              justifyContent="center"
              height={'100%'}
              sx={(theme) => ({
                bgcolor: '#cae6e0',
                borderRight: `2px solid ${theme.palette.primary.main}`
              })}
            >
              <Tabs
                orientation="vertical"
                value={selectedTab}
                onChange={(e, value) => setSelectedTab(value)}
                sx={{
                  marginRight: '-2px'
                }}
                TabIndicatorProps={{ sx: (theme) => ({ bgcolor: theme.palette.background.paper }) }}
              >
                <Tab label="Directories" value="directories" icon={<FolderIcon />} />
                <Tab label="Hidden Items" value="hiddenItems" icon={<HideImageIcon />} />
                <Tab label="Updates" value="updates" icon={<SystemUpdateAltIcon />} />
                <Tab label="About" value="about" icon={<InfoIcon />} />
              </Tabs>
            </Stack>
            <Box flex={1} p={1} pr={8} height="100%" sx={{ overflowY: 'scroll' }}>
              {selectedTab === 'directories' && <IndexedDirectoriesSettings />}
              {selectedTab === 'hiddenItems' && <HiddenItems />}
              {selectedTab === 'updates' && <Updates onShowPatchNotes={onShowPatchNotes} />}
              {selectedTab === 'about' && <About />}
            </Box>
          </Stack>
        </Box>
      </Card>
    </Stack>
  )
}
