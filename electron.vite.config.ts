import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import loadVersion from 'vite-plugin-package-version'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin(), loadVersion()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), loadVersion()]
  }
})

