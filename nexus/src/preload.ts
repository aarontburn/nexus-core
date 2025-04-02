const { ipcRenderer, contextBridge, } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
	send: (processID: string, eventType: string, data: any): Promise<any> =>
		ipcRenderer.invoke(processID, eventType, data),

	on: (channel: string, func: (event: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => void) =>
		ipcRenderer.on(channel, func),

});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv
});

