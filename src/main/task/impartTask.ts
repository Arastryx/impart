import { handleError } from '../common/handleError'
import { delay } from '../common/sleep'
import { taskMessenger } from './taskMessenger'

export type TaskType = 'indexing' | 'sourceAssociation' | 'bulkTag' | 'removing' | 'stackRemoval'

export abstract class ImpartTask<T> {
  protected abstract readonly TYPE: TaskType
  protected abstract readonly DELAY: number
  protected targets?: T[]

  protected abstract prepare(): Promise<void>
  protected abstract performStep(item: T): Promise<void>

  private canceled: boolean = false

  public async perform() {
    await this.prepare()

    if (!this.targets) {
      throw new Error('The task was not prepared properly')
    }

    taskMessenger.taskStarted(this.TYPE, this.targets.length)

    await Promise.all(
      this.targets.map((item, index) =>
        delay(async () => {
          //While it seems like it'd be nicer to just cancel the timeouts, I'm having trouble
          // figuring out a way that wouldn't leave a dangling await. I feel like it's easier
          // to just let the async functions naturally conclude
          if (this.canceled) {
            return
          }

          const result = await handleError(() => this.performStep(item))

          if (result) {
            taskMessenger.errorThrown(result)
          }

          taskMessenger.stepTaken()
        }, index * this.DELAY)
      )
    )

    taskMessenger.taskFinished()
  }

  public cancel() {
    this.canceled = true
  }
}
