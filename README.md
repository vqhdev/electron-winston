# electron-winston

Simple logger for Electron app based on [Winston](https://github.com/winstonjs/winston).

> [!TIP]
> The default write location for log files via the Electron [`app.getPath('log')`](https://www.electronjs.org/docs/latest/api/app#appgetpathname) API.
>
> - **on Linux:** `~/.config/{app name}/logs/log.log`
> - **on macOS:** `~/Library/Logs/{app name}/log.log`
> - **on Windows:** `%USERPROFILE%\AppData\Roaming\{app name}\logs\log.log`

## Install

```sh
$ npm install electron-winston
```

## Usage

### Using in Electron Main Process

```ts
import { Logger } from 'electron-winston/main'

const logger = new Logger()

logger.info('hello world')
```

### Using in Electron Renderer Process

1. Register a listener in main process, so that you can use it in the renderer process.

```ts
import { Logger } from 'electron-winston/main'

const logger = new Logger()

logger.registerRendererListener()
```

2. Expose the `Logger` API.

You can expose it in the specified preload script:

```ts
import { exposeLogger } from 'electron-winston/preload'

exposeLogger()
```

Or, you can expose it globally in the main process for all renderer processes:

```ts
import { useLogger } from 'electron-winston/main'

useLogger()
```

3. Use it in the renderer process

```ts
import logger from 'electron-winston/renderer'

logger.info('hello world')
```

## License

[MIT](./LICENSE) copyright © 2024-present alex wei
