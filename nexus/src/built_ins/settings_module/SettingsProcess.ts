import * as path from "path";
import * as fs from 'fs';
import { BrowserWindow, OpenDialogOptions, app, dialog, shell } from 'electron';
import { ModuleCompiler } from "../../ModuleCompiler";
import { ChangeEvent, IPCCallback, IPCSource, ModuleInfo, ModuleSettings, Process, Setting, SettingBox, StorageHandler } from "@nexus/nexus-module-builder";
import { HexColorSetting, NumberSetting, BooleanSetting } from "@nexus/nexus-module-builder/settings/types";

export class SettingsProcess extends Process {
    public static readonly MODULE_NAME: string = "Settings";
    public static readonly MODULE_ID: string = 'built_ins.Settings';

    private static readonly HTML_PATH: string = path.join(__dirname, "./SettingsHTML.html");

    private readonly moduleSettingsList: Map<string, ModuleSettings> = new Map();
    private readonly window: BrowserWindow;

    private readonly deletedModules: string[] = [];
    private readonly devModeSubscribers: ((isDev: boolean) => void)[] = [];


    public constructor(ipcCallback: IPCCallback, window: BrowserWindow) {
        super(
            SettingsProcess.MODULE_ID,
            SettingsProcess.MODULE_NAME,
            SettingsProcess.HTML_PATH,
            ipcCallback);
        this.window = window;

        this.getSettings().setName("General");
        this.setModuleInfo({
            moduleName: "General",
            author: "aarontburn",
            description: "General settings.",
        });

    }

    public registerSettings(): (Setting<unknown> | string)[] {
        return [
            "Display",
            new HexColorSetting(this)
                .setName("Accent Color")
                .setAccessID("accent_color")
                .setDescription("Changes the color of various elements.")
                .setDefault("#2290B5"),

            new NumberSetting(this)
                .setRange(25, 300)
                .setStep(10)
                .setName("Zoom Level (%)")
                .setDefault(100)
                .setAccessID('zoom'),

            "Developer",
            new BooleanSetting(this)
                .setName('Developer Mode')
                .setAccessID('dev_mode')
                .setDefault(false),

            new BooleanSetting(this)
                .setName("Force Reload Modules at Launch")
                .setDescription("Always recompile modules at launch. Will result in a slower boot.")
                .setAccessID("force_reload")
                .setDefault(false),
        ];
    }

    public registerInternalSettings(): Setting<unknown>[] {
        return [
            new BooleanSetting(this)
                .setName("Window Maximized")
                .setDefault(false)
                .setAccessID('window_maximized'),

            new NumberSetting(this)
                .setName('Window Width')
                .setDefault(1920)
                .setAccessID("window_width"),

            new NumberSetting(this)
                .setName('Window Height')
                .setDefault(1080)
                .setAccessID('window_height'),

            new NumberSetting(this)
                .setName('Window X')
                .setDefault(50)
                .setAccessID('window_x'),

            new NumberSetting(this)
                .setName('Window Y')
                .setDefault(50)
                .setAccessID('window_y'),
        ];
    }

    public onExit(): void {
        // Save window dimensions
        const isWindowMaximized: boolean = this.window.isMaximized();
        const bounds: { width: number, height: number, x: number, y: number } = this.window.getBounds();

        this.getSettings().getSetting('window_maximized').setValue(isWindowMaximized);
        this.getSettings().getSetting('window_width').setValue(bounds.width);
        this.getSettings().getSetting('window_height').setValue(bounds.height);
        this.getSettings().getSetting('window_x').setValue(bounds.x);
        this.getSettings().getSetting('window_y').setValue(bounds.y);

        StorageHandler.writeModuleSettingsToStorage(this);
    }



    public refreshSettings(modifiedSetting?: Setting<unknown>): void {
        if (modifiedSetting?.getAccessID() === 'zoom') {
            const zoom: number = modifiedSetting.getValue() as number;
            this.window.webContents.setZoomFactor(zoom / 100);

        } else if (modifiedSetting?.getAccessID() === 'accent_color') {
            this.sendToRenderer("refresh-settings", modifiedSetting.getValue());

        } else if (modifiedSetting?.getAccessID() === 'dev_mode') {
            this.sendToRenderer("is-dev", modifiedSetting.getValue());
            this.devModeSubscribers.forEach((callback) => {
                callback(modifiedSetting.getValue() as boolean);
            })

        }
    }


    public async handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<any> {
        switch (eventType) {
            case 'isDeveloperMode': {
                return this.getSettings().getSetting('dev_mode').getValue() as boolean;
            }
            case 'listenToDevMode': {
                const callback: (isDev: boolean) => void = data[0];
                this.devModeSubscribers.push(callback);
                callback(this.getSettings().getSetting('dev_mode').getValue() as boolean);
                break;
            }
            case "getAccentColorColor": {
                return this.getSettings().getSetting("accent_color").getValue();
            }

        }
    }

    public initialize(): void {
        super.initialize();

        this.sendToRenderer("is-dev", this.getSettings().getSetting('dev_mode').getValue());

        const settings: any[] = [];

        for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
            const moduleName: string = moduleSettings.getName();

            const list: { module: string, moduleInfo: any } = {
                module: moduleName,
                moduleInfo: moduleSettings.getModule().getModuleInfo(),
            };

            settings.push(list);
            moduleSettings.getModule().refreshAllSettings();
        }

        // Swap settings and home module so it appears at the top
        const temp = settings[0];
        settings[0] = settings[1];
        settings[1] = temp;
        this.sendToRenderer("populate-settings-list", settings);
    }

    // TODO: Restructure stuff 
    private onSettingChange(settingId: string, newValue?: any): void {
        for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
            const settingsList: Setting<unknown>[] = moduleSettings.getSettings();

            for (const setting of settingsList) {
                const settingBox: SettingBox<unknown> = setting.getUIComponent();

                for (const group of settingBox.getInputIdAndType()) {
                    const id: string = group.id;
                    if (id === settingId) { // found the modified setting
                        if (newValue === undefined) {
                            setting.resetToDefault();
                        } else {
                            setting.setValue(newValue);
                        }

                        setting.getParentModule().refreshSettings(setting);
                        console.info(`Setting setting "${setting.getName()}" to ${setting.getValue()}`)

                        const update: ChangeEvent[] = settingBox.onChange(setting.getValue());
                        StorageHandler.writeModuleSettingsToStorage(setting.getParentModule());
                        this.sendToRenderer("setting-modified", update);
                        return;
                    }
                }
            }
        }

    }

    private async importModuleArchive(): Promise<boolean> {
        const options: OpenDialogOptions = {
            properties: ['openFile'],
            filters: [{ name: 'Module Archive File (.zip, .tar)', extensions: ['zip', 'tar'] }]
        };

        const response: Electron.OpenDialogReturnValue = await dialog.showOpenDialog(options);
        if (response.canceled) {
            return undefined;
        }
        const filePath: string = response.filePaths[0];
        const successful: boolean = await ModuleCompiler.importPluginArchive(filePath);

        if (successful) {
            console.log("Successfully copied " + filePath + ". Restart required.");
            return true;
        }
        console.log("Error copying " + filePath + ".");
        return false;
    }

    private async getImportedModules(): Promise<{ name: string, deleted: boolean }[]> {
        const files: fs.Dirent[] = await fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH, { withFileTypes: true });
        // const compiledFiles: fs.Dirent[] = await fs.promises.readdir(StorageHandler.COMPILED_MODULES_PATH, { withFileTypes: true });

        const map: Map<string, boolean> = new Map();

        this.deletedModules.forEach(name => map.set(name, true))

        files.forEach(file => {
            const extension: string = path.extname(file.name);

            if (extension === '.zip') {
                map.set(file.name, false);
            }
        });

        const out: { name: string, deleted: boolean }[] = [];
        map.forEach((deleted, name) => out.push({ name: name, deleted: deleted }));

        return out;
    }


    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            case "settings-init": {
                this.initialize();
                break;
            }

            case 'open-module-folder': {
                const moduleID: string = data[0];
                shell.openPath(path.normalize(StorageHandler.STORAGE_PATH + moduleID)).then(result => {
                    if (result !== '') {
                        throw new Error('Could not find folder: ' + path.normalize(StorageHandler.STORAGE_PATH + moduleID));
                    }
                });

                break;
            }

            case 'import-module': {
                return this.importModuleArchive();
            }
            case 'manage-modules': {
                return this.getImportedModules();
            }
            case 'remove-module': {
                const fileName: string = data[0];

                const result = await fs.promises.rm(`${StorageHandler.EXTERNAL_MODULES_PATH}/${fileName}`);
                console.log("Removing " + fileName);
                if (result === undefined) {
                    this.deletedModules.push(fileName);
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            }

            case 'restart-now': {
                app.relaunch();
                app.exit();
                break;
            }

            case "swap-settings-tab": {
                const moduleName: string = data[0];

                for (const moduleSettings of Array.from(this.moduleSettingsList.values())) {
                    const name: string = moduleSettings.getName();

                    if (moduleName !== name) {
                        continue;
                    }

                    const settingsList: (Setting<unknown> | string)[] = moduleSettings.getSettingsAndHeaders();
                    const list: { module: string, moduleID: string, moduleInfo: ModuleInfo, settings: (Setting<unknown> | string)[] } = {
                        module: moduleName,
                        moduleID: moduleSettings.getModule().getIPCSource(),
                        moduleInfo: moduleSettings.getModule().getModuleInfo(),
                        settings: []
                    };

                    settingsList.forEach((s: (Setting<unknown> | string)) => {
                        if (typeof s === 'string') {
                            list.settings.push(s);
                            return;
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
                    });
                    return list;
                }

                break;
            }

            case "setting-modified": {
                const elementId: string = data[0];
                const elementValue: string = data[1];
                this.onSettingChange(elementId, elementValue);

                break;
            }

            case 'setting-reset': {
                const settingId: string = data[0];
                console.info("Resetting: " + settingId);
                this.onSettingChange(settingId);


                break;
            }
            case 'open-link': {
                const link: string = data[0];
                shell.openExternal(link);

                break;
            }
        }
    }

    public addModuleSetting(module: Process): void {
        if (this.moduleSettingsList.get(module.getIPCSource()) !== undefined) {
            return;
        }


        console.log("adding " + module.getIPCSource())
        this.moduleSettingsList.set(module.getIPCSource(), module.getSettings());
    }

}