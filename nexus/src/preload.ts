const { ipcRenderer, contextBridge, } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
	send: (rendererWindow: Window, eventType: string, data: any): Promise<any> => {
		const id = rendererWindow.frameElement?.id ?? (rendererWindow as any)["INTERNAL_ID_DO_NOT_USE"];
		return ipcRenderer.invoke(id, eventType, data)
	},

	on: (rendererWindow: Window, func: (eventName: string, ...args: any[]) => void) => {
		const id = rendererWindow.frameElement?.id ?? (rendererWindow as any)["INTERNAL_ID_DO_NOT_USE"];
		return ipcRenderer.on(id, (_: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => func(eventName, ...args));
	},


});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv

});

