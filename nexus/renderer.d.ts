
export interface IIPC {
    send(rendererWindow: Window, eventType: string, data: any[]): Promise<any>,
    on(rendererWindow: Window, func: (eventName: string, ...args: any[]) => void): Electron.IpcRenderer
}

export interface ICommon {
    args: string[]
}

declare global {
    interface Window {
        ipc: IIPC,
        common: ICommon,
    }
}