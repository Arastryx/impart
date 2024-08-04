import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void

interface Image {
  id: number
  path: string
  fileName: string
  width: number
  height: number
}

declare global {
  namespace Impart {
    interface Thumbnail extends Image {}

    interface TaggableImage extends Image {
      pinkynail: string
      tags: Impart.Tag[]
    }

    interface IndexedDirectory {
      path: string
    }

    interface Tag {
      id: number
      label: string
      color: string
    }

    interface TagGroup {
      id: number
      label: string
      tags: Tag[]
    }
  }

  interface Window {
    electron: ElectronAPI

    imageApi: {
      getThumbnail: (imageId: number) => Promise<string>
    }

    fileApi: {
      getFiles: (tagIds?: number[]) => Promise<Impart.TaggableImage[]>
      selectAndIndexDirectory: () => Promise<void>
      getDirectories: () => Promise<IndexedDirectory[]>

      openFile: (fileId: number) => void

      onIndexingStarted: CallbackFunc<{ filesFound: number }>
      onFileIndexed: CallbackFunc<Impart.TaggableImage>
      onIndexingEnded: CallbackFunc<void>
    }

    tagApi: {
      getGroups: () => Promise<Impart.TagGroup[]>
      editFileTags: (fileId: number, tagIds: number[]) => Promise<void>
    }
  }
}
