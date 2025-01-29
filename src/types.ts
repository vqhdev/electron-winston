import { LOG_LEVELS } from './constants'
import type { LoggerOptions as WinstonLoggerOptions } from 'winston'

interface IpcRenderer {
  send(channel: string, ...args: any[]): void
}

export interface API {
  ipcRenderer: IpcRenderer
}
export type LogLevel = (typeof LOG_LEVELS)[number]

export type LoggerOptions = {
  defaultTransport?: LoggerDefaultTransport | false
  winstonOptions?: WinstonLoggerOptions
}

export interface LoggerDefaultTransport {
  console?: LoggerDefaultTransportConsole | false
  file?: LoggerDefaultTransportFile | false
}
export type LoggerDefaultTransportConsole = {
  level?: LogLevel
  logInDev?: boolean
  logInProd?: boolean
  handleExceptions?: boolean
  handleRejections?: boolean
}
export type LoggerDefaultTransportFile = LoggerDefaultTransportConsole & {
  filename?: string
  maxsize?: number
  maxFiles?: number
}
