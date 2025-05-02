const { ipcRenderer, contextBridge, } = require('electron')

let moduleID: string | undefined = undefined;

contextBridge.exposeInMainWorld('ipc', {
	send: (rendererWindow: Window, eventType: string, data: any): Promise<any> => {
		if (!moduleID) {
			for (const arg of rendererWindow.common.args) {
				if (arg.startsWith("--module-id")) {
					moduleID = arg.split(":").at(-1);
					break;
				}
			}
		}
		return ipcRenderer.invoke(moduleID, eventType, data);
	},

	on: (rendererWindow: Window, func: (eventName: string, ...args: any[]) => void) => {
		if (!moduleID) {
			for (const arg of rendererWindow.common.args) {
				if (arg.startsWith("--module-id")) {
					moduleID = arg.split(":").at(-1);
					break;
				}
			}
		}

		ipcRenderer.on(moduleID, (_: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => func(eventName, ...args));

	},

	removeAllListeners: (rendererWindow: Window) => {
		if (!moduleID) {
			for (const arg of rendererWindow.common.args) {
				if (arg.startsWith("--module-id")) {
					moduleID = arg.split(":").at(-1);
					break;
				}
			}
		}

		ipcRenderer.removeAllListeners(moduleID);
	}


});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv as readonly string[]
});

