import { IPCSource, DataResponse, HTTPStatusCodes, Setting, ModuleInfo } from "@nexus-app/nexus-module-builder";
import { SettingsProcess } from "./main";
import { TabInfo } from "./types";
import { devModeSubscribers } from "./settings";



export default async function handleExternal(process: SettingsProcess, source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
    switch (eventType) {
        case "get-setting": {
            if (typeof data[0] !== 'string') {
                return { body: new Error(`Parameter is not a string.`), code: HTTPStatusCodes.BAD_REQUEST };
            }

            const nameOrAccessID: string = data[0];
            const setting: Setting<unknown> | undefined = process.getSettings().findSetting(nameOrAccessID);

            if (setting === undefined) {
                return { body: new Error(`No setting found with the name or ID of ${nameOrAccessID}.`), code: HTTPStatusCodes.BAD_REQUEST };
            }

            return { body: setting.getValue(), code: HTTPStatusCodes.OK };
        }
        case "open-settings-for-module": {
            const target: string = data[0] ?? source.getIPCSource();

            const output: TabInfo = await process.handleEvent("swap-settings-tab", [target]);

            if (output === undefined) {
                return { body: new Error(`The specified module '${target}' either doesn't exist or has no settings.`), code: HTTPStatusCodes.BAD_REQUEST };
            }

            process.requestExternal('nexus.Main', 'swap-to-module')
            process.sendToRenderer("swap-tabs", output);
            return { body: undefined, code: HTTPStatusCodes.OK };
        }

        case 'is-developer-mode': {
            return { body: process.getSettings().findSetting('dev_mode').getValue() as boolean, code: HTTPStatusCodes.OK };
        }

        case "get-accent-color": {
            return { body: process.getSettings().findSetting("accent_color").getValue(), code: HTTPStatusCodes.OK };
        }

        case "get-module-order": {
            return { body: process.getSettings().findSetting("module_order").getValue(), code: HTTPStatusCodes.OK };
        }

        case 'on-developer-mode-changed': {
            const callback: (isDev: boolean) => void = data[0];

            if (typeof callback !== "function") {
                return { body: new Error("Callback is invalid."), code: HTTPStatusCodes.BAD_REQUEST };
            }

            devModeSubscribers.push(callback);
            callback(process.getSettings().findSetting('dev_mode').getValue() as boolean);

            return { body: undefined, code: HTTPStatusCodes.OK };
        }

        default: {
            return { body: undefined, code: HTTPStatusCodes.NOT_IMPLEMENTED };
        }

    }
}