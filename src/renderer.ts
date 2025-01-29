import type { API } from './types'

class Logger {
  private api: API
  private readonly channel: string

  constructor(name: string = 'log') {
    this.channel = `__electron_winston_${name}_handler__`

    this.api =
      (globalThis || window).__ELECTRON_WINSTON__ ||
      (globalThis || window).electron
  }

  info(message: any, ...meta: unknown[]): void {
    this.api.ipcRenderer.send(this.channel, 'info', message, ...meta)
  }

  error(message: any, ...meta: unknown[]): void {
    if (message instanceof Error) {
      message = `${message.stack}`
    }
    this.api.ipcRenderer.send(this.channel, 'error', message, ...meta)
  }

  warn(message: any, ...meta: unknown[]): void {
    this.api.ipcRenderer.send(this.channel, 'warn', message, ...meta)
  }

  debug(message: any, ...meta: unknown[]): void {
    this.api.ipcRenderer.send(this.channel, 'debug', message, ...meta)
  }
}

export default new Logger()
