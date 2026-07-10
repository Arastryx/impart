import { ipcMain } from 'electron'
import { store } from '../config'
import { handleError } from '../common/handleError'
import { impartApp } from '..'
import logger from 'electron-log'

//It turns out according to the electron-store docs (https://github.com/sindresorhus/electron-store?tab=readme-ov-file#how-do-i-get-store-values-in-the-renderer-process-when-my-store-was-initialized-in-the-main-process)
// even though the store should work in the renderer, you can't actually use it
// to access the same file? Also, I just couldn't get it working at all, so instead
// we have an IPC to just get and set arbitrary config values. Hypothetically, I could set up
// a getter and setter for each config value, but I can already tell that's gonna be
// a massive headache in the future
export function setupCommonApi() {
  ipcMain.handle('common/getConfigItem', async (_e, key: string) =>
    handleError(() => ({
      //We wrap the result with an object so that it plays nice with
      // useImpartIpcData() in the renderer
      result: store.get(key)
    }))
  )

  ipcMain.on('common/setConfigItem', async (_e, key: string, value: any) =>
    handleError(() => {
      store.set(key, value)
      logger.info(`Updated the ${key} setting to ${JSON.stringify(value)}`)
    })
  )
}
