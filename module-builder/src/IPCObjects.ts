/**
 *  Interface for all classes that use IPC communication. 
 */
export interface IPCSource {
    getIPCSource(): string;
}

/**
 *  Interface to store any IPC callback functions.
 */
export interface IPCCallback {
    notifyRenderer(target: IPCSource, eventType: string, ...data: any[]): void;
    requestExternalModule(source: IPCSource, targetModuleID: string, eventType: string, ...data: any[]): Promise<any>;
}