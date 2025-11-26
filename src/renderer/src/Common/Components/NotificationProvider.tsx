import { Alert, AlertProps, Snackbar } from '@mui/material'
import { createContext, useCallback, useContext, useState } from 'react'

export interface NotificationData {
  sendError: (message: string) => void
  sendSuccess: (message: string) => void
  sendInfo: (message: string) => void
}

const NotificationContext = createContext<NotificationData | null>(null)

export interface NotificationProviderProps {
  children?: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [type, setType] = useState<AlertProps['severity']>('error')
  const [showNotification, setShowNotification] = useState(false)
  const [message, setMessage] = useState('')
  const [total, setTotal] = useState<number>(0)

  const sendNotification = useCallback(
    (m: string, t: AlertProps['severity']) => {
      if (total > 0 && type === t && message === m) {
        setTotal(total + 1)
      } else {
        setMessage(m)
        setType(t)
        setTotal(1)
      }

      setShowNotification(true)
    },
    [type, message, total]
  )

  const sendSuccess = useCallback((m: string) => sendNotification(m, 'success'), [sendNotification])
  const sendError = useCallback((m: string) => sendNotification(m, 'error'), [sendNotification])
  const sendInfo = useCallback((m: string) => sendNotification(m, 'info'), [sendNotification])

  return (
    <NotificationContext.Provider value={{ sendError, sendSuccess, sendInfo }}>
      {children}
      <Snackbar
        open={showNotification}
        onClose={() => {
          setShowNotification(false)
          setTotal(0)
        }}
      >
        <Alert variant="filled" severity={type} onClose={() => setShowNotification(false)}>
          {message} {total > 1 ? `x${total}` : undefined}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const result = useContext(NotificationContext)

  if (!result) {
    throw new Error(
      'useErrorNotification() cannot be used without being wrapped by a ErrorNotificationProvider'
    )
  }

  return result
}
