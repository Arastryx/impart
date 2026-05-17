import { createContext, useContext } from 'react'

export interface DisableDraggingData {
  disable: true
}

const DisableDraggingContext = createContext<DisableDraggingData | null>(null)

export interface DisableDraggingProps {
  children?: React.ReactNode
}

export function DisableDragging({ children }: DisableDraggingProps) {
  return (
    <DisableDraggingContext.Provider value={{ disable: true }}>
      {children}
    </DisableDraggingContext.Provider>
  )
}

//Rather than passing around a disabled prop with a true or false, we use the mere
// presence of the context to disable dragging for everything below
export function useDisableDragging() {
  return useContext(DisableDraggingContext)
}
