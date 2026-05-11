import { ipcMain } from 'electron'
import { TaggableManager } from '../tagging/taggableManager'
import { handleError } from '../common/handleError'

export function setupTaggableApi() {
  ipcMain.handle(
    'taggable/getTaggables',
    (e, ...params: Parameters<typeof TaggableManager.getTaggables>) =>
      handleError(() => TaggableManager.getTaggables(...params))
  )

  ipcMain.handle(
    'taggable/getAllTaggableYears',
    (e, ...params: Parameters<typeof TaggableManager.getAllTaggableYears>) =>
      handleError(() => TaggableManager.getAllTaggableYears(...params))
  )

  ipcMain.handle(
    'taggable/setHidden',
    (e, ...params: Parameters<typeof TaggableManager.setHidden>) =>
      handleError(() => TaggableManager.setHidden(...params))
  )

  ipcMain.handle(
    'taggable/associateImageWithFile',
    (e, ...params: Parameters<typeof TaggableManager.associateImageWithFile>) =>
      handleError(() => TaggableManager.associateImageWithFile(...params))
  )

  ipcMain.handle(
    'taggable/detachSourceFile',
    (e, ...params: Parameters<typeof TaggableManager.detachSourceFile>) =>
      handleError(() => TaggableManager.detachSourceFile(...params))
  )
}

