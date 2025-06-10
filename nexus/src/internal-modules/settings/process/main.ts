import * as path from "path";
import * as fs from 'fs';
import { BaseWindow, app, shell } from 'electron';
import { ChangeEvent, DataResponse, DIRECTORIES, HTTPStatusCodes, IPCSource, ModuleInfo, ModuleSettings, Process, Setting, SettingBox } from "@nexus-app/nexus-module-builder";
import { getImportedModules, ImportedModuleInfo, importModuleArchive } from "./module-importer";
import { getInternalSettings, getSettings, onSettingModified } from "./settings";
import { writeModuleSettingsToStorage } from "../../../init/module-loader";
import handleExternal from "./handle-external";
import { TabInfo } from "./types";
import { UPDATER_MODULE_ID as UPDATER_ID } from "../../auto-updater/updater-process";
import { VersionInfo } from "../../auto-updater/module-updater";
import { readInternal, parseInternalArgs, writeInternal } from "../../../init/internal-args";
import { NOTIFICATION_MANAGER_ID, NotificationProps } from "../../notification/notification-process";
import { MAIN_ID } from "../../../main";


const MODULE_NAME: string = "Settings";
export const MODULE_ID: string = 'nexus.Settings';

const HTML_PATH: string = path.join(__dirname, "../static/SettingsHTML.html");
const ICON_PATH: string = path.join(__dirname, "../static/setting.svg");




export class SettingsProcess extends Process {

    private readonly moduleSettingsList: Map<string, ModuleSettings> = new Map();

    private readonly deletedModules: string[] = [];
    private availableUpdates: { [moduleID: string]: VersionInfo } = {};

    public constructor() {
        super({
            moduleID: MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                htmlPath: HTML_PATH,
                iconPath: ICON_PATH
            }
        });

        this.getSettings().setDisplayName("General");
        this.setModuleInfo({
            name: "General Settings",
            id: MODULE_ID,
            version: "1.0.0",
            author: "Nexus",
            link: 'https://github.com/aarontburn/nexus-core',
            description: "General settings that control the Nexus client.",
            build: {
                "build-version": 0,
                process: ''
            },
        });

    }

    public async initialize(): Promise<void> {
        super.initialize();
        this.sendToRenderer("is-dev", this.getSettings().findSetting('dev_mode').getValue());


        this.populateSettingsList()

        this.requestExternal(UPDATER_ID, "get-all-updates").then(response => {
            if (response.code === HTTPStatusCodes.OK) {
                this.availableUpdates = response.body;
            }
        })

        this.requestExternal("aarontburn.Debug_Console", "addCommandPrefix", {
            prefix: "open-settings",
            documentation: {
                shortDescription: "Opens the settings associated with a module."
            },
            executeCommand: (args: string[]) => {
                this.handleExternal(this, 'open-settings-for-module', [args[1]]).then(console.log);
            }
        });
    }

    public registerSettings(): (Setting<unknown> | string)[] {
        return getSettings(this);
    }
    public registerInternalSettings(): Setting<unknown>[] {
        return getInternalSettings(this);
    }
    public async onSettingModified(modifiedSetting?: Setting<unknown>): Promise<void> {
        return onSettingModified(this, modifiedSetting);
    }
    public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
        return handleExternal(this, source, eventType, data);
    }


    private populateSettingsList() {
        const settings: { moduleSettingsName: string, moduleID: string, moduleInfo: ModuleInfo }[] = [];

        for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
            const moduleSettingsDisplayName: string = moduleSettings.getDisplayName();

            const list: { moduleSettingsName: string, moduleID: string, moduleInfo: ModuleInfo } = {
                moduleSettingsName: moduleSettingsDisplayName,
                moduleID: moduleSettings.getProcess().getIPCSource(),
                moduleInfo: moduleSettings.getProcess().getModuleInfo(),
            };

            if (moduleSettings.allToArray().length !== 0) {
                settings.push(list);
            }

            moduleSettings.getProcess().refreshAllSettings();
        }

        // Swap settings and home module so it appears at the top

        if (settings[0].moduleSettingsName === "Home") {
            const temp = settings[0];
            settings[0] = settings[1];
            settings[1] = temp;
        }


        this.sendToRenderer("populate-settings-list", settings);
    }





    public async onExit(): Promise<void> {
        const window: BaseWindow = (await this.requestExternal(MAIN_ID, 'get-primary-window')).body;

        // Save window dimensions
        const isWindowMaximized: boolean = window.isMaximized();
        const bounds: { width: number, height: number, x: number, y: number } = window.getBounds();

        await Promise.allSettled([
            this.getSettings().findSetting('window_maximized').setValue(isWindowMaximized),
            this.getSettings().findSetting('window_width').setValue(bounds.width),
            this.getSettings().findSetting('window_height').setValue(bounds.height),
            this.getSettings().findSetting('window_x').setValue(bounds.x),
            this.getSettings().findSetting('window_y').setValue(bounds.y),
            this.getSettings().findSetting('startup_last_open_id').setValue((await this.requestExternal(MAIN_ID, "get-current-module-id")).body),
        ])
        await this.fileManager.writeSettingsToStorage();
    }






    // TODO: Restructure stuff 
    private async onSettingChange(settingID: string, newValue?: any): Promise<void> {
        for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
            const settingsList: Setting<unknown>[] = moduleSettings.allToArray();

            for (const setting of settingsList) {
                const settingBox: SettingBox<unknown> = setting.getUIComponent();

                for (const group of settingBox.getInputIdAndType()) {
                    const id: string = group.id;
                    if (id === settingID) { // found the modified setting
                        const oldValue: unknown = setting.getValue()
                        if (newValue === undefined) {
                            await setting.resetToDefault();
                        } else {
                            await setting.setValue(newValue);
                        }

                        setting.getParentModule().onSettingModified(setting);
                        console.info(`[Nexus Settings] Setting changed: '${setting.getName()}' | ${oldValue} => ${setting.getValue()} ${newValue === undefined ? '[RESET TO DEFAULT]' : ''}`);

                        const update: ChangeEvent[] = settingBox.onChange(setting.getValue());
                        this.sendToRenderer("setting-modified", update);
                        await writeModuleSettingsToStorage(setting.getParentModule());
                        return;
                    }
                }
            }
        }

    }

    private swapSettingsTab(targetModuleID: string): TabInfo {
        for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
            if (targetModuleID !== moduleSettings.getProcess().getIPCSource()) {
                continue;
            }

            const settingsList: (Setting<unknown> | string)[] = moduleSettings.getSettingsAndHeaders();
            const list: TabInfo = {
                moduleName: moduleSettings.getDisplayName(),
                moduleID: moduleSettings.getProcess().getIPCSource(),
                moduleInfo: moduleSettings.getProcess().getModuleInfo(),
                settings: []
            };


            for (const s of settingsList) {
                if (typeof s === 'string') {
                    list.settings.push(s);
                    continue;
                }

                const setting: Setting<unknown> = s as Setting<unknown>;
                const settingBox: SettingBox<unknown> = setting.getUIComponent();
                const settingInfo: any = {
                    settingId: setting.getID(),
                    inputTypeAndId: settingBox.getInputIdAndType(),
                    ui: settingBox.getUI(),
                    style: [settingBox.constructor.name + 'Styles', settingBox.getStyle()],
                };
                list.settings.push(settingInfo);
            }
            return list;
        }


    }





    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            case "settings-init": {
                this.initialize();
                break;
            }
            case "open-popup": {
                const { body, rejectText, resolveText } = data[0];
                return new Promise((resolve) => {
                    this.requestExternal(NOTIFICATION_MANAGER_ID, "open-dialog", {
                        windowTitle: "Nexus Settings",
                        markdownContentString: body,
                        size: { width: 500, height: 300 },
                        rejectAction: {
                            text: rejectText,
                            action: function (): void {
                                resolve(false);
                            }
                        },
                        resolveAction: {
                            text: resolveText,
                            action: function (): void {
                                resolve(true)
                            }
                        }

                    } satisfies Omit<NotificationProps, "sourceModule">);
                })


            }

            case "update-module": {
                const moduleID: string = data[0];
                const response: DataResponse = await this.requestExternal(UPDATER_ID, "update-module", undefined, moduleID);
                if (response.code !== HTTPStatusCodes.OK) {
                    return false;
                }
                readInternal().then(parseInternalArgs).then((args: string[]) => {
                    if (!args.includes("--force-reload-module:" + moduleID)) {
                        args.push("--force-reload-module:" + moduleID);
                    }
                    return writeInternal(args);
                });
                return true
            }

            case "check-for-update": {
                const moduleID: string = data[0];
                const response: DataResponse = await this.requestExternal("nexus.Auto_Updater", "check-for-update", moduleID);

                if (response.code === HTTPStatusCodes.OK && response.body !== undefined) {
                    return true;
                }

                return false
            }
            case "force-reload-module": {
                const moduleID: string = data[0];
                console.info(`[Nexus Settings] Force reloading ${moduleID} on next launch.`);

                readInternal().then(parseInternalArgs).then((args: string[]) => {
                    if (!args.includes("--force-reload-module:" + moduleID)) {
                        args.push("--force-reload-module:" + moduleID);
                    }
                    return writeInternal(args);
                });
                break;
            }

            case 'open-module-folder': {
                const moduleID: string = data[0];
                shell.openPath(path.normalize(DIRECTORIES.MODULE_STORAGE_PATH + moduleID)).then(result => {
                    if (result !== '') {
                        throw new Error('Could not find folder: ' + path.normalize(DIRECTORIES.MODULE_STORAGE_PATH + moduleID));
                    }
                });

                break;
            }

            case 'import-module': {
                return await importModuleArchive();
            }
            case 'manage-modules': {
                return await getImportedModules(this, this.availableUpdates, this.deletedModules);
            }
            case 'remove-module': {
                const info: ImportedModuleInfo = data[0];

                try {
                    console.info("[Nexus Settings] Removing " + info.moduleID);
                    await fs.promises.rm(info.path.replace('\\built\\', '\\external_modules\\') + '.zip');
                    this.deletedModules.push(info.moduleID);
                    return true;

                } catch (err) {
                    console.error("[Nexus Settings] An error occurred when deleting " + info.moduleID)
                    console.error(err);
                }
                return false;
            }

            case 'restart-now': {
                app.relaunch();
                app.quit();
                break;
            }

            case "swap-settings-tab": {
                return this.swapSettingsTab(data[0]);
            }

            case "setting-modified": {
                const elementId: string = data[0];
                const elementValue: string = data[1];
                this.onSettingChange(elementId, elementValue);

                break;
            }

            case 'setting-reset': {
                const settingId: string = data[0];
                this.onSettingChange(settingId);

                break;
            }
            case 'open-link': {
                const link: string = data[0];
                shell.openExternal(link);

                break;
            }
            case "module-order": {
                const moduleOrder: string[] = data[0];
                await this.getSettings().findSetting('module_order').setValue(moduleOrder.join("|"));
                await this.fileManager.writeSettingsToStorage();
                break;
            }
            default: {
                console.warn("[Nexus Setting] Unhandled event: " + eventType)
            }
        }
    }

    public addModuleSetting(module: Process): void {
        if (this.moduleSettingsList.get(module.getIPCSource()) !== undefined) {
            return;
        }

        this.moduleSettingsList.set(module.getIPCSource(), module.getSettings());
    }

}

