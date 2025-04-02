
export interface IIPC {
    send(module: string, eventType: string, ...data: any[]): Promise<any>,
    on(channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void): Electron.IpcRenderer
}

export interface ICommon {
    args: string[]
}

declare global {
    interface Window {
        ipc: IIPC,
        common: ICommon
    }
}