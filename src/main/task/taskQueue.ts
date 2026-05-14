import { ImpartTask } from './impartTask'
import { taskMessenger } from './taskMessenger'

class TaskQueue {
  private queue: ImpartTask<any>[] = []
  private activeTask?: ImpartTask<any>
  private isProcessing = false

  public add(task: ImpartTask<any>) {
    this.queue.push(task)

    if (!this.isProcessing) {
      this.isProcessing = true
      taskMessenger.sequenceStarted()
      this.performNextTask()
    }

    taskMessenger.itemAddedToSequence()
  }

  private async performNextTask() {
    this.activeTask = this.queue.shift()

    if (this.activeTask) {
      await this.activeTask.perform()
    }

    if (this.queue.length > 0) {
      await this.performNextTask()
    } else if (this.isProcessing) {
      this.isProcessing = false
      this.activeTask = undefined
      taskMessenger.sequenceFinished()
    }
  }

  public cancelAll() {
    if (this.activeTask) {
      this.activeTask.cancel()
      this.activeTask = undefined
    }

    this.queue = []
    this.isProcessing = false
    taskMessenger.sequenceCancelled()
  }
}

export const taskQueue = new TaskQueue()
