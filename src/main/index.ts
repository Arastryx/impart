import 'reflect-metadata'
import { app, shell, BrowserWindow, protocol, net } from 'electron'
import { join } from 'path'
import url from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.ico?asset'
import { setupTaggableApi } from './api/taggableApi'
import { setupFileApi } from './api/fileApi'
import { AppDataSource } from './database/database'
import { setupTagApi } from './api/tagApi'
import { setupIndexApi } from './api/indexApi'
import { setupStackApi } from './api/stackApi'
import { ThumbnailManager } from './indexables/thumbnailManager'
import { store } from './config'
import { autoUpdater } from 'electron-updater'
import electronLog from 'electron-log'

electronLog.transports.file.level = 'info'
autoUpdater.logger = electronLog

autoUpdater.checkForUpdatesAndNotify()

interface ImpartApp {
  mainWindow?: BrowserWindow
}

export const impartApp: ImpartApp = {}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: store.get('window.width') ?? 1700,
    height: store.get('window.height') ?? 1000,
    x: store.get('window.x'),
    y: store.get('window.y'),
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true
    }
  })

  mainWindow.removeMenu()

  if (store.get('window.maximized')) {
    mainWindow.maximize()
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // open url in a browser and prevent default
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds()
    store.set('window.x', bounds.x)
    store.set('window.y', bounds.y)

    if (!mainWindow.isMaximized()) {
      store.set('window.width', bounds.width)
      store.set('window.height', bounds.height)
    }

    store.set('window.maximized', mainWindow.isMaximized())
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  impartApp.mainWindow = mainWindow
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (impartApp.mainWindow) {
      if (impartApp.mainWindow.isMinimized()) {
        impartApp.mainWindow.restore()
      }
      impartApp.mainWindow.focus()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    protocol.handle('thum', async (request) => {
      let params = request.url.slice('thum:///'.length)

      const [taggableId] = params.split('/')

      return net.fetch(
        url
          .pathToFileURL((await ThumbnailManager.getThumbnail(Number(taggableId))) ?? '')
          .toString()
      )
    })

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    await AppDataSource.initialize()

    setupFileApi()
    setupTaggableApi()
    setupStackApi()
    setupTagApi()
    setupIndexApi()

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // In this file you can include the rest of your app"s specific main process
  // code. You can also put them in separate files and require them here.
}
