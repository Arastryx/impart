import { contextBridge, ipcRenderer } from 'electron'

function generateEndpoint(channel: string) {
  return (...args: any[]) => ipcRenderer.invoke(channel, ...args)
}

function generateCommand(channel: string) {
  return (...args: any[]) => ipcRenderer.send(channel, ...args)
}

function generateCallback(channel: string) {
  return (callback: (values: any) => void) => {
    const func = (_event: Electron.IpcRendererEvent, values: any) => callback(values)
    ipcRenderer.on(channel, func)

    return () => {
      ipcRenderer.removeListener(channel, func)
    }
  }
}

contextBridge.exposeInMainWorld('commonApi', {
  getConfigItem: generateEndpoint('common/getConfigItem'),
  setConfigItem: generateCommand('common/setConfigItem'),
  onConfigUpdated: generateCallback('common/configUpdated')
})

contextBridge.exposeInMainWorld('fileApi', {
  openFile: generateCommand('file/openFile'),
  openFileLocation: generateCommand('file/openFileLocation')
})

contextBridge.exposeInMainWorld('taskApi', {
  onSequenceStarted: generateCallback('task/sequenceStarted'),
  onItemAddedToSequence: generateCallback('task/itemAddedToSequence'),
  onTaskStarted: generateCallback('task/taskStarted'),
  onStepTaken: generateCallback('task/stepTaken'),
  onErrorThrown: generateCallback('task/errorThrown'),
  onTaskFinished: generateCallback('task/taskFinished'),
  onSequenceFinished: generateCallback('task/sequenceFinished')
})

contextBridge.exposeInMainWorld('taggableApi', {
  getTaggables: generateEndpoint('taggable/getTaggables'),
  getAllTaggableYears: generateEndpoint('taggable/getAllTaggableYears'),
  setHidden: generateEndpoint('taggable/setHidden'),
  associateImageWithFile: generateEndpoint('taggable/associateImageWithFile'),
  detachSourceFile: generateEndpoint('taggable/detachSourceFile')
})

contextBridge.exposeInMainWorld('stackApi', {
  create: generateEndpoint('stack/create'),
  rename: generateEndpoint('stack/rename'),
  setCover: generateEndpoint('stack/setCover'),
  addToStack: generateEndpoint('stack/addToStack'),
  moveToHome: generateEndpoint('stack/moveToHome'),
  remove: generateEndpoint('stack/remove')
})

contextBridge.exposeInMainWorld('tagApi', {
  getGroups: generateEndpoint('tag/getGroups'),
  editFileTags: generateEndpoint('tag/editFileTags'),
  bulkTag: generateEndpoint('tag/bulkTag'),
  addTags: generateEndpoint('tag/addTags'),

  createGroup: generateEndpoint('tag/createGroup'),
  editGroup: generateEndpoint('tag/editGroup'),
  reorderGroups: generateEndpoint('tag/reorderGroups'),
  deleteGroup: generateEndpoint('tag/deleteGroup'),

  createTag: generateEndpoint('tag/createTag'),
  editTag: generateEndpoint('tag/editTag'),
  reorderTags: generateEndpoint('tag/reorderTags'),
  deleteTag: generateEndpoint('tag/deleteTag')
})

contextBridge.exposeInMainWorld('indexApi', {
  indexAll: generateEndpoint('index/indexAll'),
  selectDirectory: generateEndpoint('index/selectDirectory'),
  updateDirectories: generateEndpoint('index/updateDirectories'),
  calculateTotalIndexChanges: generateEndpoint('index/calculateTotalIndexChanges'),
  getDirectories: generateEndpoint('index/getDirectories')
})

contextBridge.exposeInMainWorld('thumbnailApi', {
  onBuildingThumbnail: generateCallback('thumbnail/buildingThumbnail'),
  onThumbnailBuilt: generateCallback('thumbnail/thumbnailBuilt')
})

