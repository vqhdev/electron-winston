import type { API } from './types'

class Logger {
  private api: API
  private channel: string

  constructor(name: string = 'log') {
    this.channel = `__electron_winston_${name}_handler__`

    this.api =
      (globalThis || window).__ELECTRON_WINSTON__ ||
      (globalThis || window).electron
  }

  info(message: any): void {
    this.api.ipcRenderer.send(this.channel, 'info', message)
  }

  error(message: any): void {
    if (message instanceof Error) {
      this.api.ipcRenderer.send(this.channel, 'error', `${message.stack}`)
    } else {
      this.api.ipcRenderer.send(this.channel, 'error', message)
    }
  }

  warn(message: any): void {
    this.api.ipcRenderer.send(this.channel, 'warn', message)
  }
}

export default new Logger()
