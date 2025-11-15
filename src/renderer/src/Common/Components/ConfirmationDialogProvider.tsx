import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import React, { createContext, useCallback, useContext, useRef, useState } from 'react'
import CheckIcon from '@mui/icons-material/CheckRounded'

export interface ConfirmProps {
  title?: string
  body?: React.ReactNode
  danger?: boolean
  confirmText?: string
  confirmIcon?: React.ReactNode
}

interface InternalConfirmProps extends ConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => unknown | Promise<unknown>
}

function Confirm({
  title,
  body,
  danger,
  confirmText,
  confirmIcon,
  open,
  onClose,
  onConfirm
}: InternalConfirmProps) {
  const [isConfirming, setConfirming] = useState(false)

  const confirm = async () => {
    setConfirming(true)
    await onConfirm()
    setConfirming(false)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {body && <DialogContent>{body}</DialogContent>}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {isConfirming && <CircularProgress />}
        {!isConfirming && (
          <Button
            variant="contained"
            onClick={confirm}
            color={danger ? 'error' : undefined}
            startIcon={confirmIcon ?? <CheckIcon />}
          >
            {confirmText ?? 'Confirm'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export interface ConfirmationDialogData {
  confirm: (props: ConfirmProps, onConfirm: () => unknown | Promise<unknown>) => void
}

const ConfirmationDialogContext = createContext<ConfirmationDialogData | null>(null)

export interface ConfirmationDialogProviderProps {
  children?: React.ReactNode
}

export function ConfirmationDialogProvider({ children }: ConfirmationDialogProviderProps) {
  const [show, setShow] = useState(false)
  const [props, setProps] = useState<ConfirmProps>()
  const funcRef = useRef<() => unknown | Promise<unknown>>(() => {})

  const confirm = useCallback((p: ConfirmProps, onConfirm: () => unknown | Promise<unknown>) => {
    if (show) {
      throw new Error('Attempted to show a confirmation dialog while one was already showing')
    }

    setShow(true)
    setProps(p)
    funcRef.current = onConfirm
  }, [])

  return (
    <ConfirmationDialogContext.Provider value={{ confirm }}>
      {children}
      {props && (
        <Confirm
          open={show}
          onClose={() => setShow(false)}
          onConfirm={async () => {
            if (!funcRef.current) {
              throw new Error('Confirmation callback does not exist')
            }

            await funcRef.current()
            setShow(false)
          }}
          {...props}
        />
      )}
    </ConfirmationDialogContext.Provider>
  )
}

export function useConfirmationDialog() {
  const result = useContext(ConfirmationDialogContext)

  if (!result) {
    throw new Error(
      'useConfirmationDialog() cannot be used without being wrapped by a ConfirmationDialogProvider'
    )
  }

  return result.confirm
}
