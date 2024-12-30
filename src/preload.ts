import { contextBridge, ipcRenderer } from 'electron'

import type { API } from './types'

const api: API = {
  ipcRenderer: {
    send(channel, ...args) {
      return ipcRenderer.send(channel, ...args)
    }
  }
}

/**
 * Expose config in the specified preload script.
 */
export function exposeLogger(): void {
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld(`__ELECTRON_WINSTON__`, api)
    } catch (error) {
      console.error(error)
    }
  } else {
    // @ts-ignore (need dts)
    window.__ELECTRON_WINSTON__ = api
  }
}
