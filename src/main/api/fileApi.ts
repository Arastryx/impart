import { ipcMain } from 'electron'
import { fileManager } from '../file/fileManager'

export function setupFileApi() {
  ipcMain.handle('file/getFiles', () => fileManager.getFiles())
  ipcMain.handle('file/selectAndIndexDirectory', () => fileManager.selectAndIndexDirectory())
  ipcMain.handle('file/getDirectories', () => fileManager.getIndexedDirectories())

  ipcMain.on('file/openFile', (_e, id: number) => fileManager.openFile(id))
}
