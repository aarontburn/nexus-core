import { DataResponse, HTTPStatusCode, IPCCallback, IPCSource, Process } from "@nexus/nexus-module-builder"
import { BrowserWindow } from "electron"



export const getIPCCallback = (browserWindow: BrowserWindow): IPCCallback => {
    return {
        notifyRenderer: (target: IPCSource, eventType: string, ...data: any[]) => {
            browserWindow.webContents.send(target.getIPCSource(), eventType, data);
        },
        requestExternalModule: requestExternalModule
    }
}

const requestExternalModule = async (
    source: IPCSource,
    targetModuleID: string,
    eventType: string,
    ...data: any[]): Promise<DataResponse> => {

    if (targetModuleID === this.getIPCSource()) {
        return await this.handleExternal(source, eventType, data);
    }


    const targetModule: Process = this.modulesByIPCSource.get(targetModuleID);
    if (targetModule === undefined) {
        console.error(`Module '${source.getIPCSource()}' attempted to access '${targetModuleID}', but no such module exists.`);
        return { body: `No module with ID of ${source.getIPCSource()} found.`, code: HTTPStatusCode.NOT_FOUND };
    }

    const response: DataResponse = await targetModule.handleExternal(source, eventType, data)
    return response;
}