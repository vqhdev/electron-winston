interface IpcRenderer {
  send(channel: string, ...args: any[]): void
}

export interface API {
  ipcRenderer: IpcRenderer
}
