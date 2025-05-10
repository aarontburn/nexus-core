import { InputElement, ModuleInfo } from "@nexus-app/nexus-module-builder";

export interface TabInfo {
    moduleName: string;
    moduleID: string;
    moduleInfo: ModuleInfo;
    settings: ({
        settingId: string;
        inputTypeAndId: InputElement[];
        ui: string;
        style: [string, string];
    } | string)[];
}