import { ipcMain } from 'electron'
import { handleError } from '../common/handleError'
import { IndexingManager } from '../indexables/indexingManager'
import { DirectoryManager } from '../indexables/directoryManager'

export function setupIndexApi() {
  ipcMain.handle('index/indexAll', () => handleError(() => IndexingManager.indexAll()))
  ipcMain.handle('index/selectDirectory', () => DirectoryManager.selectDirectory())
  ipcMain.handle('index/getDirectories', () =>
    handleError(() => DirectoryManager.getIndexedDirectories())
  )
  ipcMain.handle(
    'index/updateDirectories',
    (e, ...params: Parameters<typeof DirectoryManager.updateDirectories>) =>
      handleError(() => DirectoryManager.updateDirectories(...params))
  )
  ipcMain.handle(
    'index/calculateTotalIndexChanges',
    (e, ...params: Parameters<typeof DirectoryManager.calculateTotalIndexChanges>) =>
      handleError(() => DirectoryManager.calculateTotalIndexChanges(...params))
  )
}
