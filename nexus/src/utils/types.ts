import { IPCCallback, IPCSource, Process } from "@nexus/nexus-module-builder";
import { BrowserWindow } from "electron";
import { SettingsProcess } from "../built_ins/settings_module/process/SettingsProcess";

export interface InitContext {
    moduleMap: Map<string, Process>;
    window: BrowserWindow;
    settingModule: SettingsProcess;
    mainIPCSource: IPCSource;
    displayedModule: Process;

    setProcessReady: () => void;
    setRendererReady: () => void;
    ipcCallback: IPCCallback
}