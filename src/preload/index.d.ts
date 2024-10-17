import { ElectronAPI } from '@electron-toolkit/preload'

type CallbackFunc<Payload> = (callback: (values: Payload) => void) => () => void
type Result<Payload> = Promise<Payload | Impart.Error>

declare global {
  namespace Impart {
    interface Dimensions {
      width: number
      height: number
    }

    interface FileIndex {
      path: string
      fileName: string
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //TAGGABLE
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    interface Directory {
      path: string
      autoTags: number[]
    }

    interface CountedDirectory extends Directory {
      taggableCount: number
    }

    interface BaseTaggable {
      id: number
      tags: Impart.Tag[]
      dateModified: Date
    }

    interface TaggableImage extends BaseTaggable {
      fileIndex: FileIndex
      dimensions: Dimensions
      source?: TaggableFile
    }

    interface TaggableFile extends BaseTaggable {
      fileIndex: FileIndex
    }

    interface TaggableStack extends BaseTaggable {
      taggables: Taggable[]
      name: string
      cover?: TaggableImage
    }

    type Taggable = TaggableImage | TaggableFile | TaggableStack

    interface FetchTaggablesOptions {
      tagIds?: number[]
      order?: 'alpha' | 'date'
      search?: string
      year?: number
      stackId?: number
      onlyHidden?: boolean
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //TAGS
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    interface Tag {
      id: number
      label?: string
      tagOrder: number
      color?: string
    }

    interface TagGroup {
      id: number
      label?: string
      groupOrder: number
      defaultTagColor?: string
      tags?: Tag[]
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //MISC
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    type TaskType = 'indexing' | 'sourceAssociation' | 'bulkTag' | 'removing'

    interface Error {
      message: string
      name?: string
      stack?: string
    }
  }

  interface Window {
    electron: ElectronAPI

    fileApi: {
      openFile: (indexableId: number) => void
      openFileLocation: (indexableId: number) => void
    }

    taggableApi: {
      getTaggables: (options?: Impart.FetchTaggablesOptions) => Result<Impart.Taggable[]>
      getAllTaggableYears: () => Result<number[]>

      setHidden: (ids: number[], hidden: boolean) => Result<void>
    }

    stackApi: {
      create: (
        name: string,
        taggableIds: number[],
        coverId: number,
        parentStackId?: number
      ) => Result<void>
      addToStack: (
        taggableIds: number[],
        stackId: number,
        currentStackId?: number
      ) => Result<boolean>
      moveToHome: (taggableIds: number[], currentStackId: number) => Result<boolean>
      remove: (stackId: number) => Result<void>
    }

    taskApi: {
      onSequenceStarted: CallbackFunc<void>
      onItemAddedToSequence: CallbackFunc<void>
      onTaskStarted: CallbackFunc<{ type: Impart.TaskType; steps: number }>
      onStepTaken: CallbackFunc<void>
      onTaskFinished: CallbackFunc<void>
      onSequenceFinished: CallbackFunc<void>
    }

    tagApi: {
      getGroups: () => Result<Impart.TagGroup[]>
      editFileTags: (taggableId: number, tagIds: number[]) => Result<void>
      bulkTag: (taggableIds: number[], tagIds: number[]) => Result<void>
      addTags: (taggableId: number, tagIds: number[]) => Result<void>

      createGroup: () => Result<Impart.TagGroup>
      editGroup: (id: number, label?: string, defaultTagColor?: string) => Result<Impart.TagGroup>
      deleteGroup: (id: number) => Result<true>

      createTag: (groupId: number) => Result<Impart.Tag>
      editTag: (tagId: number, label?: string, color?: string) => Result<Impart.Tag>
      deleteTag: (id: number) => Result<true>
    }

    indexApi: {
      indexAll: () => Promise<void>
      selectDirectory: () => Promise<string | undefined>
      updateDirectories: (payload: Impart.Directory[]) => Result<void>
      getDirectories: () => Result<Impart.CountedDirectory[]>
    }

    thumbnailApi: {
      onBuildingThumbnail: CallbackFunc<void>
      onThumbnailBuilt: CallbackFunc<void>
    }
  }
}
