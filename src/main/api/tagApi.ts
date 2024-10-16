import { ipcMain } from 'electron'
import { TagManager } from '../tagging/tagManager'
import { handleError } from '../common/handleError'

export function setupTagApi() {
  ipcMain.handle('tag/getGroups', () => handleError(() => TagManager.getTagGroups()))

  ipcMain.handle('tag/editFileTags', (e, fileId: number, tagIds: number[]) =>
    handleError(() => TagManager.setFileTags(fileId, tagIds))
  )
  ipcMain.handle('tag/bulkTag', (e, ...params: Parameters<typeof TagManager.bulkTag>) =>
    handleError(() => TagManager.bulkTag(...params))
  )
  ipcMain.handle('tag/addTags', (e, ...params: Parameters<typeof TagManager.addTags>) =>
    handleError(() => TagManager.addTags(...params))
  )

  ipcMain.handle('tag/createGroup', () => handleError(() => TagManager.createGroup()))
  ipcMain.handle('tag/editGroup', (e, ...params: Parameters<typeof TagManager.editGroup>) =>
    handleError(() => TagManager.editGroup(...params))
  )
  ipcMain.handle('tag/deleteGroup', (e, ...params: Parameters<typeof TagManager.deleteGroup>) =>
    handleError(() => TagManager.deleteGroup(...params))
  )

  ipcMain.handle('tag/createTag', (e, groupId: number) =>
    handleError(() => TagManager.createTag(groupId))
  )
  ipcMain.handle('tag/editTag', (e, ...params: Parameters<typeof TagManager.editTag>) =>
    handleError(() => TagManager.editTag(...params))
  )
  ipcMain.handle('tag/deleteTag', (e, ...params: Parameters<typeof TagManager.deleteTag>) =>
    handleError(() => TagManager.deleteTag(...params))
  )
}
