import logger from 'electron-log'

export interface ImpartError {
  message: string
  stack?: string
  name?: string
}

export async function handleError<T>(func: () => T | Promise<T>): Promise<T | ImpartError> {
  try {
    return await func()
  } catch (e) {
    let error: ImpartError = { message: '' }

    if (e instanceof Error) {
      error = e
    } else if (typeof e === 'string') {
      error = {
        message: e
      }
    } else {
      error = {
        message: 'An unknown error has occurred'
      }
    }

    logger.error(e)
    return error
  }
}
