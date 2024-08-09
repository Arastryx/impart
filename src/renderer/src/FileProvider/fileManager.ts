export interface FileState {
  isIndexing: boolean
  filesIndexed: number
  total: number
  files: Impart.Taggable[]
}

type OnChangeCallback = (state: FileState) => void

export class FileManager {
  private listeners: (() => void)[] = []
  private onChange?: OnChangeCallback

  private isIndexing = false
  private filesIndexed = 0
  private total = 0

  private files: Impart.Taggable[] = []

  public static getInitialState(): FileState {
    return {
      isIndexing: false,
      filesIndexed: 0,
      total: 0,
      files: []
    }
  }

  public constructor() {
    this.listeners.push(
      window.fileApi.onIndexingStarted((e) => {
        this.isIndexing = true
        this.filesIndexed = 0
        this.total = e.filesFound
        this.change()
      })
    )

    this.listeners.push(
      window.fileApi.onFileIndexed((t) => {
        this.filesIndexed++
        this.files.push(t)
        this.change()
      })
    )

    this.listeners.push(
      window.fileApi.onIndexingEnded(() => {
        setTimeout(() => {
          this.isIndexing = false
          this.change()
        }, 3000)
      })
    )
  }

  public setOnChange(callback: OnChangeCallback) {
    this.onChange = callback
  }

  public async fetchAll(tagsIds?: number[]) {
    if (this.files.length > 0) {
      this.files = []
      this.change()
    }

    this.files = await window.fileApi.getFiles(tagsIds)
    this.change()
  }

  private change() {
    this.onChange &&
      this.onChange({
        isIndexing: this.isIndexing,
        filesIndexed: this.filesIndexed,
        total: this.total,
        files: this.files
      })
  }

  public destroy() {
    this.listeners.forEach((removeListener) => removeListener())
  }
}
