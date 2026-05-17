import { app } from 'electron'
import electronLog from 'electron-log'
import { autoUpdater } from 'electron-updater'
import path from 'path'

export function initLogging() {
  electronLog.transports.file.level = 'info'
  autoUpdater.logger = electronLog

  const appData = app.getPath('appData')

  electronLog.transports.file.resolvePathFn = () =>
    path.join(appData, 'impart/logs', import.meta.env.DEV ? 'dev.log' : 'main.log')
}
