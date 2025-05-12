
export interface IIPC {
    sendToProcess(eventType: string, data: any[]): Promise<any>;
    onProcessEvent(func: (eventType: string, ...args: any[]) => void): void;
	removeAllListeners(): void;
}

export interface ICommon {
    args: readonly string[]
}

declare global {
    interface Window {
        ipc: IIPC,
        common: ICommon
    }
}