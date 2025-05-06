import * as path from "path";
import * as fs from 'fs';
import { BaseWindow, WebContentsView, app, nativeTheme, shell } from 'electron';
import { ChangeEvent, DataResponse, DIRECTORIES, HTTPStatusCodes, IPCSource, ModuleInfo, ModuleSettings, Process, Setting, SettingBox } from "@nexus-app/nexus-module-builder";
import { getImportedModules, importModuleArchive } from "./ModuleImporter";
import { getInternalSettings, getSettings } from "./settings";
import { parseInternalArgs, readInternal, writeInternal } from "../../../init/internal-args";
import { writeModuleSettingsToStorage } from "../../../init/module-loader";


const MODULE_NAME: string = "Settings";
export const MODULE_ID: string = 'nexus.Settings';

const HTML_PATH: string = path.join(__dirname, "../static/SettingsHTML.html");
const ICON_PATH: string = path.join(__dirname, "../static/setting.svg");


interface TabInfo {
    moduleName: string,
    moduleID: string,
    moduleInfo: ModuleInfo,
    settings: any[]
}

export class SettingsProcess extends Process {

    private readonly moduleSettingsList: Map<string, ModuleSettings> = new Map();

    private readonly deletedModules: string[] = [];
    private readonly devModeSubscribers: ((isDev: boolean) => void)[] = [];


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
            name: "General",
            author: "aarontburn",
            description: "General settings.",
        });

    }

    public async initialize(): Promise<void> {
        super.initialize();
        this.sendToRenderer("is-dev", this.getSettings().findSetting('dev_mode').getValue());

        const settings: { moduleSettingsName: string, moduleID: string, moduleInfo: any }[] = [];

        for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
            const moduleName: string = moduleSettings.getDisplayName();

            const list: { moduleSettingsName: string, moduleID: string, moduleInfo: any } = {
                moduleSettingsName: moduleName,
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

        this.requestExternal("aarontburn.Debug_Console", "addCommandPrefix", {
            prefix: "open-settings",
            documentation: {
                shortDescription: "Opens the settings associated with a module."
            },
            executeCommand: (args: string[]) => {
                this.handleExternal(this, 'open-settings-for-module', [args[1]]).then(console.log);
            }
        })
    }

    public registerSettings(): (Setting<unknown> | string)[] {
        return getSettings(this);
    }

    public registerInternalSettings(): Setting<unknown>[] {
        return getInternalSettings(this);
    }

    public async onExit(): Promise<void> {
        const window: BaseWindow = BaseWindow.getAllWindows()[0];

        // Save window dimensions
        const isWindowMaximized: boolean = window.isMaximized();
        const bounds: { width: number, height: number, x: number, y: number } = window.getBounds();

        await Promise.allSettled([
            this.getSettings().findSetting('window_maximized').setValue(isWindowMaximized),
            this.getSettings().findSetting('window_width').setValue(bounds.width),
            this.getSettings().findSetting('window_height').setValue(bounds.height),
            this.getSettings().findSetting('window_x').setValue(bounds.x),
            this.getSettings().findSetting('window_y').setValue(bounds.y),
            this.getSettings().findSetting('startup_last_open_id').setValue((await this.requestExternal("nexus.Main", "get-current-module-id")).body),
        ])
        await this.fileManager.writeSettingsToStorage();
    }



    public async onSettingModified(modifiedSetting?: Setting<unknown>): Promise<void> {
        if (modifiedSetting === undefined) {
            return;
        }
        switch (modifiedSetting.getAccessID()) {
            case "zoom": {
                const zoom: number = modifiedSetting.getValue() as number;

                BaseWindow.getAllWindows()[0].contentView.children.forEach(
                    (view: WebContentsView) => {
                        view.webContents.setZoomFactor(zoom / 100);
                        view.emit("bounds-changed");
                    });

                break;
            }
            case "accent_color": {
                BaseWindow.getAllWindows()[0].contentView.children.forEach(
                    (view: WebContentsView) => {
                        view.webContents.executeJavaScript(`document.documentElement.style.setProperty('--accent-color', '${modifiedSetting.getValue()}')`)
                    });
                break;
            }
            case "dev_mode": {
                this.sendToRenderer("is-dev", modifiedSetting.getValue());
                this.devModeSubscribers.forEach((callback) => {
                    callback(modifiedSetting.getValue() as boolean);
                })
                break;
            }

            case "force_reload": {
                const shouldForceReload: boolean = modifiedSetting.getValue() as boolean;

                readInternal().then(parseInternalArgs).then(args => {
                    if (shouldForceReload) {
                        if (!args.includes("--force-reload")) {
                            args.push("--force-reload");
                        }
                    } else {
                        args = args.filter(arg => arg !== "--force-reload");
                    }

                    return writeInternal(args);
                })
                break;

            }
            case "dark_mode": {
                // System, Dark, Light
                const mode: string = modifiedSetting.getValue() as string;
                nativeTheme.themeSource = mode.toLowerCase() as any;
                break;
            }
        }

    }


    public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
        switch (eventType) {
            case "get-setting": {
                if (typeof data[0] !== 'string') {
                    return { body: new Error(`Parameter is not a string.`), code: HTTPStatusCodes.BAD_REQUEST };
                }

                const nameOrAccessID: string = data[0];
                const setting: Setting<unknown> | undefined = this.getSettings().findSetting(nameOrAccessID);

                if (setting === undefined) {
                    return { body: new Error(`No setting found with the name or ID of ${nameOrAccessID}.`), code: HTTPStatusCodes.BAD_REQUEST };
                }

                return { body: setting.getValue(), code: HTTPStatusCodes.OK };
            }
            case "open-settings-for-module": {
                const target: string = data[0] ?? source.getIPCSource();


                const output: TabInfo = this.swapSettingsTab(target);

                if (output === undefined) {
                    return { body: new Error(`The specified module '${target}' either doesn't exist or has no settings.`), code: HTTPStatusCodes.BAD_REQUEST };
                }

                this.requestExternal('nexus.Main', 'swap-to-module')
                this.sendToRenderer("swap-tabs", output);
                return { body: undefined, code: HTTPStatusCodes.OK };
            }

            case 'is-developer-mode': {
                return { body: this.getSettings().findSetting('dev_mode').getValue() as boolean, code: HTTPStatusCodes.OK };
            }

            case "get-accent-color": {
                return { body: this.getSettings().findSetting("accent_color").getValue(), code: HTTPStatusCodes.OK };
            }

            case "get-module-order": {
                return { body: this.getSettings().findSetting("module_order").getValue(), code: HTTPStatusCodes.OK };
            }

            case 'on-developer-mode-changed': {
                const callback: (isDev: boolean) => void = data[0];

                if (typeof callback !== "function") {
                    return { body: new Error("Callback is invalid."), code: HTTPStatusCodes.BAD_REQUEST };
                }

                this.devModeSubscribers.push(callback);
                callback(this.getSettings().findSetting('dev_mode').getValue() as boolean);

                return { body: undefined, code: HTTPStatusCodes.OK };
            }

            default: {
                return { body: undefined, code: HTTPStatusCodes.NOT_IMPLEMENTED };
            }

        }
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





    public async handleEvent(eventType: string, data: any): Promise<any> {
        switch (eventType) {
            case "settings-init": {
                this.initialize();
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
                return importModuleArchive();
            }
            case 'manage-modules': {
                return getImportedModules(this.deletedModules);
            }
            case 'remove-module': {
                const fileName: string = data[0];

                const result = await fs.promises.rm(`${DIRECTORIES.EXTERNAL_MODULES_PATH}/${fileName}`);
                console.info("[Nexus Settings] Removing " + fileName);
                if (result === undefined) {
                    this.deletedModules.push(fileName);
                    return true;
                }
                return false;
            }

            case 'restart-now': {
                app.relaunch();
                app.exit();
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
                await this.fileManager.writeSettingsToStorage()
                break;
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

