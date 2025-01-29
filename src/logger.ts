import path from 'node:path'
import winston, { format, createLogger } from 'winston'
import { app, ipcMain } from 'electron'

import type { Logger as WinstonLogger } from 'winston'
import { LoggerOptions } from './types'
export class Logger {
  private readonly logger: WinstonLogger
  private renderLogger?: WinstonLogger

  constructor(readonly options?: LoggerOptions) {
    const { exitOnError = false, ...wOptions } = options?.winstonOptions || {}
    this.logger = createLogger({
      exitOnError,
      ...wOptions
    })
    this.setupDefaultTransport(options)
  }
  private setupDefaultTransport(options: LoggerOptions | undefined): void {
    if (options?.defaultTransport === false) {
      return
    }
    const printf = format.printf(
      (info) =>
        `[${info.timestamp}] [${info.level}] ${info.pid ? '[renderer] ' : ''}${info.message}`
    )
    if (options?.defaultTransport?.file !== false) {
      const {
        filename,
        level = 'info',
        logInDev = false,
        logInProd = true,
        maxsize = 1048576 * 20,
        maxFiles = 2,
        handleRejections = true,
        handleExceptions = true
      } = options?.defaultTransport?.file || {}
      if (
        (logInDev && process.env.NODE_ENV !== 'production') ||
        (logInProd && process.env.NODE_ENV === 'production')
      ) {
        this.logger.add(
          new winston.transports.File({
            filename: filename || path.join(app.getPath('logs'), 'log.log'),
            format: format.combine(
              format.timestamp({
                format: 'MM-DD HH:mm:ss.SSS'
              }),
              format.errors({ stack: true }),
              format.splat(),
              printf
            ),
            level,
            maxFiles,
            maxsize,
            tailable: true,
            handleExceptions,
            handleRejections
          })
        )
      }
    }
    if (options?.defaultTransport?.console !== false) {
      const {
        level = 'debug',
        logInDev = true,
        logInProd = false,
        handleRejections = true,
        handleExceptions = true
      } = options?.defaultTransport?.console || {}
      if (
        (logInDev && process.env.NODE_ENV !== 'production') ||
        (logInProd && process.env.NODE_ENV === 'production')
      ) {
        this.logger.add(
          new winston.transports.Console({
            format: format.combine(
              format.timestamp({
                format: 'HH:mm:ss.SSS'
              }),
              format.colorize({
                all: true
              }),
              format.splat(),
              printf
            ),
            handleExceptions,
            handleRejections,
            level: level
          })
        )
      }
    }
  }

  get winstonLogger(): WinstonLogger {
    return this.logger
  }

  /**
   * Register the logger ipc handler for renderer.
   * @param name The name used to define the renderer logger. Default to `log`.
   */
  registerRendererListener(name?: string): void {
    this.renderLogger = this.logger.child({ pid: 'renderer' })
    const channel = `__electron_winston_${name || 'log'}_handler__`
    if (!ipcMain.eventNames().some((e) => e === channel)) {
      ipcMain.on(
        channel,
        (_, level: string, message: string, ...meta: unknown[]) => {
          this.renderLogger?.log(level, message, ...meta)
        }
      )
    }
  }

  info(message: string, ...meta: unknown[]): void {
    this.logger.info(message, ...meta)
  }
  error(message: string, ...meta: unknown[]): void {
    this.logger.error(message, ...meta)
  }
  warn(message: string, ...meta: unknown[]): void {
    this.logger.warn(message, ...meta)
  }

  debug(message: string, ...meta: unknown[]): void {
    this.logger.debug(message, ...meta)
  }
}
