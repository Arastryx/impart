import { ipcMain } from 'electron'
import { store } from '../config'
import { sleep } from '../common/sleep'

//Accessing the store from the renderer appears to be throwing an error,
// which apparently has something to do with this being electron-vite.
// There's an experimental plugin that allegedly makes it work, but honestly
// for just this one time, it's easier to just get it from the backend
export function setupCommonApi() {
  ipcMain.handle('common/getPreviousVersion', async (_e) => ({
    version: store.get('previousVersion')
  }))
}
