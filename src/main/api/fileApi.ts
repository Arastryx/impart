import { ipcMain } from 'electron'
import { indexingManager } from '../indexables/indexingManager'

export function setupFileApi() {
  ipcMain.on('file/openFile', (_e, id: number) => indexingManager.openFile(id))
  ipcMain.on('file/openFileLocation', (_e, id: number) => indexingManager.openFileLocation(id))
}
