import { DataResponse, HTTPStatusCodes, IPCSource, Process, Setting } from "@nexus-app/nexus-module-builder";
import { MODULE_ID as HOME_PROCESS_ID } from "../home/HomeProcess";
import { MODULE_ID as SETTINGS_PROCESS_ID } from "../settings/process/main";
import { NOTIFICATION_MANAGER_ID } from "../notification/notification-process";
import { MAIN_ID } from "../../main";
import { UPDATER_MODULE_ID } from "../auto-updater/updater-main";
import { BooleanSetting, StringSetting } from "@nexus-app/nexus-module-builder/settings/types";
import crypto from 'crypto';

const MODULE_NAME: string = "Nexus Analytics";
export const ANALYTIC_MODULE_ID: string = 'nexus.Analytics';


const ALLOWED_ANALYTIC_TYPES = [
    "REMOTE_CLIENT_FIRST_BOOT",
    "REMOTE_CLIENT_UPDATED",
    "REMOTE_CLIENT_UNINSTALL",
    "REMOTE_INSTALLED_MODULE_FROM_SITE",
    "REMOTE_IMPORTED_MODULE",
    "REMOTE_UPDATED_MODULE",
    "REMOTE_CLIENT_ACTIVE"
] as const;



type RemoteAnalyticTypes = typeof ALLOWED_ANALYTIC_TYPES[number];

const TEN_MIN: number = 10 * 60 * 1000;

export class AnalyticProcess extends Process {

    public constructor() {
        super({
            moduleID: ANALYTIC_MODULE_ID,
            moduleName: MODULE_NAME,
        });

        this.setModuleInfo({
            name: MODULE_NAME,
            id: ANALYTIC_MODULE_ID,
            version: "1.0.0",
            author: "Nexus",
            description: "The Nexus analytic handler.",
            link: 'https://github.com/aarontburn/nexus-core',
            build: {
                "build-version": 0,
                process: ''
            },
            platforms: ['win32', 'darwin'],
        });

    }

    public async beforeWindowCreated(): Promise<void> {
        let needToWrite: boolean = false;

        const isFirstLaunchSetting: Setting<unknown> = this.getSettings().findSetting("is_first_launch")!;
        if (isFirstLaunchSetting.getValue()) {
            this.handleExternal(this, "send-analytic", ["REMOTE_CLIENT_FIRST_BOOT"]);

            await isFirstLaunchSetting.setValue(false);
            needToWrite = true;
        } 

        const uidSetting: Setting<unknown> = this.getSettings().findSetting("uid")!;
        if (uidSetting.getValue() === "") {
            await uidSetting.setValue(crypto.randomUUID());
            needToWrite = true;
        }
        
        if (needToWrite) {
            await this.fileManager.writeSettingsToStorage();
        }
    }

    public registerInternalSettings(): Setting<unknown>[] {
        return [
            new BooleanSetting(this)
                .setName("First Launch - DO NOT CHANGE")
                .setAccessID("is_first_launch")
                .setDefault(true),

            new StringSetting(this)
                .setName("Analytic UID - DO NOT CHANGE")
                .setAccessID("uid")
                .setDefault("")
        ];
    }

    public registerSettings(): (Setting<unknown> | string)[] {
        return [];
    }

    public async initialize(): Promise<void> {
        super.initialize();

        this.handleExternal(this, "send-analytic", ["REMOTE_CLIENT_ACTIVE"]);
        setTimeout(() => {
            this.handleExternal(this, "send-analytic", ["REMOTE_CLIENT_ACTIVE"]);
        }, TEN_MIN);
    }

    public async onSettingModified(modifiedSetting?: Setting<unknown> | undefined): Promise<void> {
        // do nothing
    }



    public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
        switch (eventType) {
            case "send-analytic": {
                // data[0] should be a RemoteAnalyticTypes
                // data[1] should be an object containing the analytic data or undefined
                if (process.argv.includes("--dev") && !process.argv.includes("--in-core")) {
                    return {
                        code: HTTPStatusCodes.NO_CONTENT, // don't send analytic events if its from a developer working on a module
                        body: undefined
                    };
                }

                const WHITELISTED_MODULES: readonly string[] = [
                    HOME_PROCESS_ID,
                    SETTINGS_PROCESS_ID,
                    ANALYTIC_MODULE_ID,
                    NOTIFICATION_MANAGER_ID,
                    MAIN_ID,
                    UPDATER_MODULE_ID
                ] as const;

                if (!WHITELISTED_MODULES.includes(source.getIPCSource())) {
                    return {
                        code: HTTPStatusCodes.FORBIDDEN,
                        body: undefined
                    }
                }

                if (process.argv.includes("--in-core")) {
                    console.info("Sending analytic: " + JSON.stringify(data));
                }

                const type: RemoteAnalyticTypes = data[0];
                if (!ALLOWED_ANALYTIC_TYPES.includes(type)) {
                    return {
                        code: HTTPStatusCodes.BAD_REQUEST,
                        body: `Invalid analytic type: ${type}`
                    }
                }

                const analyticData: object | undefined = data[1];

                const uidSetting: Setting<unknown> = this.getSettings().findSetting("uid")!;

                const requestBody: { [key: string]: any } = {
                    "NEXUS_TYPE": type,
                    "uid": uidSetting.getValue() as string || null,
                    ...analyticData
                }

                if (process.argv.includes("--in-core")) {
                    requestBody["isDevTest"] = true;
                }

                try {
                    const response: Response = await fetch("https://nexus-app.net/api/remote-analytics",
                        {
                            method: "POST",
                            body: JSON.stringify(requestBody)
                        }
                    );

                    if (response.status === 201) {
                        return {
                            code: HTTPStatusCodes.OK,
                            body: undefined
                        }
                    }

                    if (process.argv.includes("--in-core")) {
                        console.warn("Error response received from sending analytic: " + JSON.stringify(requestBody));
                    }

                } catch (e) {
                    if (process.argv.includes("--in-core")) {
                        console.warn("Error sending analytic: " + JSON.stringify(requestBody));
                        console.warn(e)
                    }
                }
                return {
                    code: HTTPStatusCodes.NOT_ACCEPTABLE,
                    body: undefined
                }
            }
            default: {
                return { code: HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined };
            }
        }
    }



}


