import React from 'react'
import ReactDOM from 'react-dom/client'
import { Impart } from './Impart'
import { TagProvider } from './EntityProviders/TagProvider'
import { TaggableProvider } from './EntityProviders/TaggableProvider'
import { DirectoryProvider } from './EntityProviders/DirectoryProvider'
import { TaskStatusProvider } from './TaskStatusProvider'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { NotificationProvider } from './Common/Components/NotificationProvider'
import { ActiveContextMenuProvider } from './Common/Components/ContextMenu/ActiveContextMenuProvider'
import { ConfirmationDialogProvider } from './Common/Components/ConfirmationDialogProvider'
import 'animate.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <NotificationProvider>
      <TaskStatusProvider>
        <DirectoryProvider>
          <TaggableProvider>
            <TagProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ActiveContextMenuProvider>
                  <ConfirmationDialogProvider>
                    <Impart />
                  </ConfirmationDialogProvider>
                </ActiveContextMenuProvider>
              </ThemeProvider>
            </TagProvider>
          </TaggableProvider>
        </DirectoryProvider>
      </TaskStatusProvider>
    </NotificationProvider>
  </React.StrictMode>
)

