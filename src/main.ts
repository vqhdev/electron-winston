import { fileURLToPath } from 'node:url'
import { session as _session } from 'electron'

import { type Session } from 'electron'

export * from './logger'

type Options = {
  /**
   * Attach ES module preload script.
   *
   * @default false
   */
  esModule: boolean
}

/**
 * Use logger for the specified session.
 */
export function useLogger(
  session: Session = _session.defaultSession,
  options: Options = { esModule: false }
): void {
  session.setPreloads([
    ...session.getPreloads(),
    fileURLToPath(
      new URL(
        options.esModule
          ? 'electron-winston-preload.mjs'
          : 'electron-winston-preload.cjs',
        import.meta.url
      )
    )
  ])
}
