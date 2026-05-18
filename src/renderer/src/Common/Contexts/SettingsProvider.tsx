import { useNotification } from '@renderer/Common/Components/NotificationProvider'
import { resolve, useImpartIpcCall, useImpartIpcData } from '@renderer/Common/Hooks/useImpartIpc'
import { produce } from 'immer'
import { createContext, useCallback, useContext, useEffect } from 'react'

type RendererSettings = Omit<Impart.ConfigItems, 'previousVersion'>

export interface SettingsData {
  settings?: RendererSettings
  isLoading: boolean
  updateSetting: (key: keyof Impart.ConfigItems, value: any) => void
}

const SettingsContext = createContext<SettingsData | null>(null)

async function get<Key extends keyof Impart.ConfigItems>(
  key: Key,
  defaultValue: Impart.ConfigItems[Key],
  sendError: (value: string) => void
) {
  return resolve(await window.commonApi.getConfigItem(key), sendError)?.result ?? defaultValue
}

export interface SettingsProviderProps {
  children?: React.ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { sendError } = useNotification()

  const {
    data: settings,
    isLoading,
    setData: setSettings
  } = useImpartIpcData(
    async (): Promise<RendererSettings> => ({
      applyTagsOnSourceAssociation: await get('applyTagsOnSourceAssociation', true, sendError),
      autoUpdatingEnabled: await get('autoUpdatingEnabled', true, sendError),
      showPatchNotesOnUpdate: await get('showPatchNotesOnUpdate', true, sendError)
    }),
    [sendError]
  )

  const updateSetting = useCallback(
    async (key: keyof Impart.ConfigItems, value: any) => {
      await window.commonApi.setConfigItem(key, value)

      setSettings(
        produce(settings, (s) => {
          if (s) {
            s[key] = value
          }

          return s
        })
      )
    },
    [settings]
  )

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSetting<Key extends keyof RendererSettings>(key: Key) {
  const result = useContext(SettingsContext)

  if (!result) {
    throw new Error('useSettings() cannot be used without being wrapped by a SettingsProvider')
  }

  const updateSetting = useCallback(
    (value: RendererSettings[Key]) => result.updateSetting(key, value),
    [result.updateSetting, key]
  )

  return {
    setting: result.settings ? result.settings[key] : undefined,
    isLoading: result.isLoading,
    updateSetting
  }
}
