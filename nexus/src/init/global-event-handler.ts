import { DataResponse, HTTPStatusCode, IPCCallback, IPCSource, Process } from "@nexus/nexus-module-builder"
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

export function swapVisibleModule(context: InitContext, moduleID: string): void {
    const module: Process = context.moduleMap.get(moduleID);
    const view: WebContentsView = context.moduleViewMap.get(moduleID);
    if (module === context.displayedModule) {
        return; // If the module is the same, don't swap
    }



    for (const id of Array.from(context.moduleViewMap.keys())) {
        if (id === context.mainIPCSource.getIPCSource()) continue;

        context.moduleViewMap.get(id).setVisible(false);
    }

    view.setVisible(true);

    context.displayedModule?.onGUIHidden();
    module.onGUIShown();
    context.displayedModule = module;
    context.ipcCallback.notifyRenderer(context.mainIPCSource, 'swap-modules', moduleID);
}


export function handleExternalWrapper(context: InitContext) {
    return async function handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<DataResponse> {
        switch (eventType) {
            case "get-module-IDs": {
                return { body: Array.from(context.moduleMap.keys()), code: HTTPStatusCode.OK };
            }
            case "get-current-module-id": {
                return { body: context.displayedModule.getID(), code: HTTPStatusCode.OK };
            }
            default: {
                return { body: undefined, code: HTTPStatusCode.NOT_IMPLEMENTED };
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
            return { body: `No module with ID of ${source.getIPCSource()} found.`, code: HTTPStatusCode.NOT_FOUND };
        }

        const response: DataResponse = await targetModule.handleExternal(source, eventType, data)
        return response;
    }
}

