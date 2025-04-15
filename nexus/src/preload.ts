const { ipcRenderer, contextBridge, } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
	send: (rendererWindow: Window, eventType: string, data: any): Promise<any> => {
		for (const arg of rendererWindow.common.args) {
			if (arg.startsWith("--module-id")) {
				return ipcRenderer.invoke(arg.split(":").at(-1), eventType, data)
			}
		}
	},

	on: (rendererWindow: Window, func: (eventName: string, ...args: any[]) => void) => {
		for (const arg of rendererWindow.common.args) {
			if (arg.startsWith("--module-id")) {
				return ipcRenderer.on(arg.split(":").at(-1), (_: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => func(eventName, ...args));
			}
		}
	},


});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv

});

