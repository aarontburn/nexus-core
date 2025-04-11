import { BrowserWindow, desktopCapturer, ipcMain, session } from "electron";
import * as path from "path";
import { SettingsProcess } from "./built_ins/settings_module/process/SettingsProcess";
import { HomeProcess } from "./built_ins/home_module/HomeProcess";
import { ModuleCompiler } from "./compiler/ModuleCompiler";
import { IPCSource, Process, IPCCallback, ModuleSettings, StorageHandler, Setting, HTTPStatusCode, DataResponse } from "@nexus/nexus-module-builder";
import { reorderModules } from "./utils/ModuleReorderer";


const WINDOW_DIMENSION: { width: number, height: number } = { width: 1920, height: 1080 } as const;

export class ModuleController implements IPCSource {

    private readonly ipc: Electron.IpcMain = ipcMain;
    private modulesByIPCSource: Map<string, Process> = new Map();

    private settingsModule: SettingsProcess;
    private window: BrowserWindow;
    private currentDisplayedModule: Process;

    private processReady: boolean = false;
    private rendererReady: boolean = false;

    private ipcCallback: IPCCallback;


    public getIPCSource(): string {
        return "built_ins.Main";
    }

    public start(): void {
        this.createBrowserWindow();
        this.handleMainEvents();

        this.settingsModule = new SettingsProcess(this.window);
        this.settingsModule.setIPC(this.ipcCallback)

        this.registerModules().then(() => {
            if (this.rendererReady) {
                this.init();
            } else {
                this.processReady = true;
            }

            const settings: ModuleSettings = this.settingsModule.getSettings();
            this.window.setBounds({
                x: Number(settings.findSetting('window_x').getValue()),
                y: Number(settings.findSetting('window_y').getValue()),
                height: Number(settings.findSetting('window_height').getValue()),
                width: Number(settings.findSetting('window_width').getValue()),
            });

            if ((settings.findSetting('window_maximized').getValue() as boolean) === true) {
                this.window.maximize();
            }

            this.window.show();
        });



    }


    private init(): void {
        const data: any[] = [];
        this.modulesByIPCSource.forEach((module: Process) => {
            console.log(module.getURL())
            data.push({
                moduleName: module.getName(),
                moduleID: module.getIPCSource(),
                htmlPath: module.getHTMLPath(),
                iconPath: module.getIconPath(),
                url: module.getURL()?.toString()
            });
        });
        this.ipcCallback.notifyRenderer(this, 'load-modules', data);

        let startupModuleID: string = "built_ins.Home";

        const openLastModule: boolean = this.settingsModule
            .getSettings()
            .findSetting("startup_should_open_last_closed")
            .getValue() as boolean;

        if (openLastModule) {
            startupModuleID = this.settingsModule
                .getSettings()
                .findSetting("startup_last_open_id")
                .getValue() as string;
        } else {
            startupModuleID = this.settingsModule.getSettings().findSetting("startup_module_id").getValue() as string;
            if (!this.modulesByIPCSource.has(startupModuleID)) {
                startupModuleID = "built_ins.Home";
            }
        }

        this.swapVisibleModule(startupModuleID);

        this.modulesByIPCSource.forEach((module: Process) => {
            if (module.getHTMLPath() === undefined) {
                module.initialize();
            }
        });
        this.addDebugConsoleCommands();
    }

    private addDebugConsoleCommands(): void {
        this.ipcCallback.requestExternalModule(this, "aarontburn.Debug_Console", "addCommandPrefix", {
            prefix: "installed-modules",
            executeCommand: (args: string[]) => {
                console.info(Array.from(this.modulesByIPCSource.keys()))
            },
            documentation: {
                shortDescription: "Lists IDs of all installed modules."
            }
        })
    }
    private handleMainEvents(): void | Promise<any> {
        this.ipc.handle(this.getIPCSource(), (_, eventType: string, data: any[]) => {
            switch (eventType) {
                case "renderer-init": {
                    if (this.processReady) {
                        this.init();
                    } else {
                        this.rendererReady = true;
                    }
                    break;
                }
                case "swap-modules": {
                    this.swapVisibleModule(data[0]);
                    break;
                }
                case "module-order": {
                    this.settingsModule.handleEvent("module-order", data);
                    break;
                }

            }

        });
    }



    private async handleExternal(source: IPCSource, eventType: string, ...data: any[]): Promise<DataResponse> {
        switch (eventType) {
            case "get-module-IDs": {
                return { body: Array.from(this.modulesByIPCSource.keys()), code: HTTPStatusCode.OK };
            }
            case "get-current-module-id": {
                return { body: this.currentDisplayedModule.getID(), code: HTTPStatusCode.OK };
            }
            default: {
                return { body: undefined, code: HTTPStatusCode.NOT_IMPLEMENTED };
            }

        }
    }

    public async stop(): Promise<void> {
        await Promise.all(Array.from(this.modulesByIPCSource.values()).map(async module => await module.onExit()));
    }

    private swapVisibleModule(moduleID: string): void {
        const module: Process = this.modulesByIPCSource.get(moduleID);
        if (module === this.currentDisplayedModule) {
            return; // If the module is the same, don't swap
        }

        this.currentDisplayedModule?.onGUIHidden();
        module.onGUIShown();
        this.currentDisplayedModule = module;
        this.ipcCallback.notifyRenderer(this, 'swap-modules', moduleID);
    }


    private createBrowserWindow(): void {
        session.defaultSession.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36");

        this.window = new BrowserWindow({
            show: false,
            height: WINDOW_DIMENSION.height,
            width: WINDOW_DIMENSION.width,
            webPreferences: {
                webviewTag: true,
                additionalArguments: process.argv,
                backgroundThrottling: false,
                preload: path.join(__dirname, "preload.js"),
            },
            autoHideMenuBar: true
        });


        this.window.on('close', async (event) => {
            event.preventDefault();
            try {
                await this.stop();
                this.window.destroy();
            } catch (error) {
                console.error("Error during cleanup:", error);
            }
        })


        this.window.loadFile(path.join(__dirname, "./view/index.html")).then(() => {
            this.window.webContents.on("did-finish-load", () => {
                this.init();
            });
        });


        this.ipcCallback = {
            notifyRenderer: (target: IPCSource, eventType: string, ...data: any[]) => {
                this.window.webContents.send(target.getIPCSource(), eventType, data);
            },
            requestExternalModule: this.handleInterModuleCommunication.bind(this) // Not sure if the binding is required
        }


    }

    private async handleInterModuleCommunication(source: IPCSource, targetModuleID: string, eventType: string, ...data: any[]): Promise<DataResponse> {
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

    private async registerModules(): Promise<void> {
        console.log("Registering modules...");

        const home: HomeProcess = new HomeProcess();
        home.setIPC(this.ipcCallback);
        this.addModule(home);
        this.addModule(this.settingsModule);

        this.settingsModule.addModuleSetting(await this.verifyModuleSettings(home));
        this.settingsModule.addModuleSetting(await this.verifyModuleSettings(this.settingsModule));

        const forceReload: boolean = this.settingsModule
            .getSettings()
            .findSetting("force_reload")
            .getValue() as boolean;

        const moduleOrder: string = this.settingsModule
            .getSettings()
            .findSetting("module_order")
            .getValue() as string;


        console.log("Force Reload: " + forceReload);


        const loadedModules: Process[] = reorderModules(moduleOrder, await ModuleCompiler.load(this.ipcCallback, forceReload));
        await this.settingsModule
            .getSettings()
            .findSetting('module_order')
            .setValue(loadedModules.map(module => module.getID()).join("|"));
        await StorageHandler.writeModuleSettingsToStorage(this.settingsModule);

        for (const module of loadedModules) {
            await this.addModule(module);
        }
        for (const module of loadedModules) {
            this.settingsModule.addModuleSetting(await this.verifyModuleSettings(module));
        }
    }

    private async addModule(module: Process): Promise<void> {
        const moduleID: string = module.getIPCSource();

        const existingIPCProcess: Process = this.modulesByIPCSource.get(moduleID);
        if (existingIPCProcess !== undefined) {
            console.error("WARNING: Modules with duplicate IDs have been found.");
            console.error(`ID: ${moduleID} | Registered Module: ${existingIPCProcess.getName()} | New Module: ${module.getName()}`);
            return;
        }

        console.log("\tRegistering " + moduleID);

        this.modulesByIPCSource.set(moduleID, module);

        this.ipc.handle(moduleID, (_, eventType: string, data: any = []) => {
            return module.handleEvent(eventType, data);
        });
    }


    private async verifyModuleSettings(module: Process): Promise<Process> {
        const settingsMap: Map<string, any> = await StorageHandler.readSettingsFromModuleStorage(module);

        const moduleSettings: ModuleSettings = module.getSettings();


        await Promise.allSettled(Array.from(settingsMap).map(async ([settingName, settingValue]) => {

            const setting: Setting<unknown> = moduleSettings.findSetting(settingName);
            if (setting === undefined) {
                console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
            } else {
                await setting.setValue(settingValue);
            }

            if (settingName === "Startup Module ID") {
                console.log(setting.getValue())
            }
        }))
        await StorageHandler.writeModuleSettingsToStorage(module);
        return module;
    }




}