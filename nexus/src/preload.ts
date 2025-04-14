const { ipcRenderer, contextBridge, } = require('electron')

contextBridge.exposeInMainWorld('ipc', {
	send: (rendererWindow: Window, eventType: string, data: any): Promise<any> => {
		// const id = rendererWindow.frameElement?.id ?? (rendererWindow as any)["INTERNAL_ID_DO_NOT_USE"];
		
		for (const arg of rendererWindow.common.args) {
			if (arg.startsWith("--module-id")) {
				console.log(arg.split(":").at(-1))
				return ipcRenderer.invoke(arg.split(":").at(-1), eventType, data)
			}
		}
		console.log("Couldn't find id")
		console.log(rendererWindow)

	},

	on: (rendererWindow: Window, func: (eventName: string, ...args: any[]) => void) => {
		// const id = rendererWindow.frameElement?.id ?? (rendererWindow as any)["INTERNAL_ID_DO_NOT_USE"];

		for (const arg of rendererWindow.common.args) {
			if (arg.startsWith("--module-id")) {
				console.log(arg.split(":").at(-1))

				return ipcRenderer.on(arg.split(":").at(-1), (_: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => func(eventName, ...args));
			}
		}
		console.log("Couldn't find id")
		console.log(rendererWindow)


	},


});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv

});

