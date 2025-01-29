import { app, BrowserWindow } from 'electron'
import { Logger, useLogger } from '../dist/main.mjs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
const logger = new Logger()
logger.registerRendererListener()
logger.info('Hello from main process')
const __dirname = fileURLToPath(new URL('.', import.meta.url))
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //preload: './preload.js'
    }
  })
  win.loadFile(path.join(__dirname, 'index.html'))
}
app.whenReady().then(() => {
  createWindow()
  useLogger()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
