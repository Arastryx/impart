import { app } from 'electron'
import Store, { Schema } from 'electron-store'

interface Config {
  'window.width': number
  'window.height': number
  'window.x': number
  'window.y': number
  'window.maximized': boolean
}

const schema: Schema<Config> = {
  'window.width': {},
  'window.height': {},
  'window.x': {},
  'window.y': {},
  'window.maximized': {}
}

export const store = new Store({
  accessPropertiesByDotNotation: true,
  schema,
  name: app.isPackaged ? undefined : 'config-dev'
})
