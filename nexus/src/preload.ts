const { ipcRenderer, contextBridge, } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
	send: (target: string, eventType: string, ...data: any): Promise<any> =>
		ipcRenderer.invoke(target, eventType, data),

	on: (channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) =>
		ipcRenderer.on(channel, func),

    invoke: (channel: string, func: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
		return ipcRenderer.invoke(channel, func);
	}
});

contextBridge.exposeInMainWorld("common", {
	args: process.argv
});

