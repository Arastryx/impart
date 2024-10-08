import { delay } from '../common/sleep'
import { taskMessenger } from './taskMessenger'

export type TaskType = 'indexing' | 'sourceAssociation' | 'bulkTag'

type Queueable = () => Promise<any>

interface QueuedTask {
  steps: Queueable[] | (() => Promise<Queueable[]>)
  delayPerItem: number
  type: TaskType
}

class TaskQueue {
  private queue: QueuedTask[] = []
  private isProcessing = false

  public add(task: QueuedTask) {
    this.queue.push(task)

    if (!this.isProcessing) {
      this.isProcessing = true
      taskMessenger.sequenceStarted()
      this.performNextTask()
    }

    taskMessenger.itemAddedToSequence()
  }

  private async performNextTask() {
    const task = this.queue.shift()

    if (task) {
      const steps = typeof task.steps === 'function' ? await task.steps() : task.steps
      taskMessenger.taskStarted(task.type, steps.length)

      await Promise.all(
        steps.map((func, index) =>
          delay(async () => {
            await func()
            taskMessenger.stepTaken()
          }, index * task.delayPerItem)
        )
      )

      taskMessenger.taskFinished()
    }

    if (this.queue.length > 0) {
      await this.performNextTask()
    } else {
      this.isProcessing = false
      taskMessenger.sequenceFinished()
    }
  }
}

export const taskQueue = new TaskQueue()
