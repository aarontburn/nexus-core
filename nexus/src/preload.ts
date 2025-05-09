const { ipcRenderer, contextBridge, } = require('electron')


let PRELOAD_MODULE_ID: string | undefined = undefined;
contextBridge.exposeInMainWorld('ipc', {
	send: (rendererWindow: Window, eventType: string, data: any): Promise<any> => {
		if (!PRELOAD_MODULE_ID) {
			for (const arg of rendererWindow.common.args) {
				if (arg.startsWith("--module-id")) {
					PRELOAD_MODULE_ID = arg.split(":").at(-1);
					break;
				}
			}
		}
		return ipcRenderer.invoke(PRELOAD_MODULE_ID, eventType, data);
	},

	on: (rendererWindow: Window, func: (eventName: string, ...args: any[]) => void) => {
		if (!PRELOAD_MODULE_ID) {
			for (const arg of rendererWindow.common.args) {
				if (arg.startsWith("--module-id")) {
					PRELOAD_MODULE_ID = arg.split(":").at(-1);
					break;
				}
			}
		}

		ipcRenderer.on(PRELOAD_MODULE_ID, (_: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => func(eventName, ...args));

	},

	removeAllListeners: (rendererWindow: Window) => {
		if (!PRELOAD_MODULE_ID) {
			for (const arg of rendererWindow.common.args) {
				if (arg.startsWith("--module-id")) {
					PRELOAD_MODULE_ID = arg.split(":").at(-1);
					break;
				}
			}
		}

		ipcRenderer.removeAllListeners(PRELOAD_MODULE_ID);
	}


});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv as readonly string[]
});


