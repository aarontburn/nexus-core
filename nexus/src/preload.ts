const { ipcRenderer, contextBridge, } = require('electron')


let PRELOAD_MODULE_ID: string | undefined = undefined;


function getModuleID() {
	if (!PRELOAD_MODULE_ID) {
		for (const arg of process.argv) {
			if (arg.toLocaleLowerCase().startsWith("--module-id")) {
				PRELOAD_MODULE_ID = arg.split(":").at(-1).toLocaleLowerCase();
				break;
			}
		}
	}
	if (PRELOAD_MODULE_ID === undefined) {
		throw new Error(`Could not find module ID within renderers 'process.argv'.`);
	}


	return PRELOAD_MODULE_ID;
}

contextBridge.exposeInMainWorld('ipc', {
	sendToProcess: (eventType: string, data: any): Promise<any> => ipcRenderer.invoke(getModuleID(), eventType, data),
	onProcessEvent: (func: (eventName: string, ...args: any[]) => void) => {
		ipcRenderer.on(getModuleID(), (_: Electron.IpcRendererEvent, eventName: string, ...args: any[]) => func(eventName, ...args));
	},

	removeAllListeners: () => {
		ipcRenderer.removeAllListeners(getModuleID());
	}
});

// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
	args: process.argv as readonly string[]
});