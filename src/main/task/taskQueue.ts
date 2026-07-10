import { ImpartTask } from './impartTask'
import { taskMessenger } from './taskMessenger'

class TaskQueue {
  private sequence: Sequence | null = null

  public add(task: ImpartTask<any>) {
    if (this.sequence) {
      this.sequence.add(task)
    } else {
      this.launchSequence(task)
    }
  }

  private async launchSequence(task: ImpartTask<any>) {
    this.sequence = new Sequence()
    this.sequence.add(task)

    const sequenceId = this.sequence.id
    await this.sequence.begin()

    //If we haven't cancelled this sequence and booted up another one in the mean time,
    // clear out the current sequence
    if (sequenceId == this.sequence?.id) {
      this.sequence = null
    }
  }

  public cancelAll() {
    this.sequence?.cancelAll()
    this.sequence = null
  }
}

let idCounter = 1

class Sequence {
  public id = idCounter++
  private queue: ImpartTask<any>[] = []
  private activeTask?: ImpartTask<any>
  private isProcessing = false

  public constructor() {
    taskMessenger.sequenceStarted()
  }

  public add(task: ImpartTask<any>) {
    this.queue.push(task)
    taskMessenger.itemAddedToSequence()
  }

  public async begin() {
    this.isProcessing = true

    while (this.queue.length > 0) {
      this.activeTask = this.queue.shift()
      if (this.activeTask) {
        await this.activeTask.perform()
      }
    }

    if (this.isProcessing) {
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
