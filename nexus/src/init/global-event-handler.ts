import { DataResponse, HTTPStatusCodes, IPCCallback, IPCSource, Process } from "@nexus-app/nexus-module-builder"
import { InitContext } from "../utils/types";
import { ipcMain, WebContentsView } from "electron";



export const getIPCCallback = (context: InitContext): IPCCallback => {
    return {
        notifyRenderer: notifyRendererWrapper(context),
        requestExternalModule: requestExternalModuleWrapper(context)
    }
}


export function attachEventHandlerForMain(context: InitContext): void | Promise<any> {
    ipcMain.handle(context.mainIPCSource.getIPCSource().toLowerCase(), (_, eventType: string, data: any[]) => {
        switch (eventType) {
            case "renderer-init": {
                context.setRendererReady();
                break;
            }
            case "swap-modules": {
                swapVisibleModule(context, data[0]);
                break;
            }
            case "module-order": {
                context.settingModule.handleEvent("module-order", data);
                break;
            }

        }

    });
}

export function swapVisibleModule(context: InitContext, moduleID: string): boolean {
    const module: Process = context.moduleMap.get(moduleID);
    if (module === context.displayedModule) {
        return false; // If the module is the same, don't swap
    }

    for (const id of Array.from(context.moduleViewMap.keys())) {
        if (id === context.mainIPCSource.getIPCSource() || id === moduleID) {
            continue;
        };
        context.moduleViewMap.get(id).setVisible(false);
    }
    context.displayedModule?.onGUIHidden();

    module.onGUIShown();
    context.moduleViewMap.get(moduleID).setVisible(true);

    context.displayedModule = module;
    context.ipcCallback.notifyRenderer(context.mainIPCSource, 'swapped-modules-to', moduleID);
    return true;
}


export function handleExternalWrapper(context: InitContext) {
    return async function handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
        switch (eventType) {
            case "get-module-IDs": {
                return { body: Array.from(context.moduleMap.keys()), code: HTTPStatusCodes.OK };
            }
            case "get-current-module-id": {
                return { body: context.displayedModule.getID(), code: HTTPStatusCodes.OK };
            }
            case "open-dev-tools": {
                // Only allow aarontburn.Debug_Console to open devtools for other modules
                const target: string = source.getIPCSource() === "aarontburn.Debug_Console" ? data[1] : source.getIPCSource();

                const POSSIBLE_MODES: string[] = ['left', 'right', 'bottom', 'detach'];
                let mode: string = data[0] ?? "right"; // load on right by default
                if (!POSSIBLE_MODES.includes(mode)) { // if the mode is invalid, set to default
                    mode = "right";
                }

                if (!context.moduleViewMap.has(target)) {
                    return {
                        body: new Error(`Could not open devtools for ${target}; either module doesn't exist or module is an internal module.`),
                        code: HTTPStatusCodes.NOT_FOUND
                    };
                }

                const view: WebContentsView = context.moduleViewMap.get(target);
                if (view.webContents.isDevToolsOpened()) {
                    view.webContents.closeDevTools();
                }
                view.webContents.openDevTools({ mode: mode as any });
                return { body: "Success: Opened devtools for " + target, code: HTTPStatusCodes.OK };
            }
            case "reload": {
                // Only allow aarontburn.Debug_Console to reload other modules
                const target: string = source.getIPCSource() === "aarontburn.Debug_Console" ? data[0] : source.getIPCSource();
                if (!context.moduleViewMap.has(target)) {
                    return {
                        body: new Error(`Could not refresh for ${target}; either module doesn't exist or module is an internal module.`),
                        code: HTTPStatusCodes.NOT_FOUND
                    };
                }

                const view: WebContentsView = context.moduleViewMap.get(target);
                if (data.includes("--force")) {
                    view.webContents.reloadIgnoringCache();
                } else {
                    view.webContents.reload();
                }

                return { body: "Success: Refreshed page for " + target, code: HTTPStatusCodes.OK };
            }
            case "swap-to-module": {
                // data[0] should be the target module ID, or if undefined, will be the caller module.
                
                const target: string = data[0] ?? source.getIPCSource();
                if (!context.moduleViewMap.has(target)) {
                    return {
                        body: new Error(`Could not swap to ${target}; either module doesn't exist or module is an internal module.`),
                        code: HTTPStatusCodes.NOT_FOUND
                    };
                }
                const didSwap: boolean = swapVisibleModule(context, target);
                if (didSwap) {
                    return { body: `Success: Swapped visible module to ${target}`, code: HTTPStatusCodes.OK };
                } else {
                    return { body: `Success: ${target} is already visible.`, code: HTTPStatusCodes.ALREADY_REPORTED };
                }
            }
            default: {
                return { body: undefined, code: HTTPStatusCodes.NOT_IMPLEMENTED };
            }

        }
    }
}



const notifyRendererWrapper = (context: InitContext) => {
    return (target: IPCSource, eventType: string, ...data: any[]) => {
        context.moduleViewMap.get(target.getIPCSource()).webContents.send(target.getIPCSource().toLowerCase(), eventType, data);
    }
}

const requestExternalModuleWrapper = (context: InitContext) => {

    return async (source: IPCSource, targetModuleID: string, eventType: string, ...data: any[]): Promise<DataResponse> => {
        if (targetModuleID === context.mainIPCSource.getIPCSource()) {
            return await handleExternalWrapper(context)(source, eventType, data);
        }


        const targetModule: Process = context.moduleMap.get(targetModuleID);
        if (targetModule === undefined) {
            return { body: `No module with ID of ${targetModuleID} found.`, code: HTTPStatusCodes.NOT_FOUND };
        }

        const response: DataResponse = await targetModule.handleExternal(source, eventType, data)
        return response;
    }

}

