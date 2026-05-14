import { impartApp } from '..'
import { ImpartError } from '../common/handleError'
import { TaskType } from './impartTask'

class TaskMessenger {
  public sequenceStarted() {
    impartApp.mainWindow?.webContents.send('task/sequenceStarted')
  }

  public itemAddedToSequence() {
    impartApp.mainWindow?.webContents.send('task/itemAddedToSequence')
  }

  public taskStarted(type: TaskType, steps: number) {
    impartApp.mainWindow?.webContents.send('task/taskStarted', {
      type,
      steps
    })
  }

  public stepTaken() {
    impartApp.mainWindow?.webContents.send('task/stepTaken')
  }

  public errorThrown(error: ImpartError) {
    impartApp.mainWindow?.webContents.send('task/errorThrown', error)
  }

  public taskFinished() {
    impartApp.mainWindow?.webContents.send('task/taskFinished')
  }

  public sequenceFinished() {
    impartApp.mainWindow?.webContents.send('task/sequenceFinished')
  }

  public sequenceCancelled() {
    impartApp.mainWindow?.webContents.send('task/sequenceCancelled')
  }
}

export const taskMessenger = new TaskMessenger()
