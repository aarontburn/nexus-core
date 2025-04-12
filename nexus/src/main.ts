import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { ModuleController } from "./ModuleController";
import * as os from "os";
import * as fs from "fs";
import { getInternalArguments } from "./init/InternalHandler";
import { Process } from "@nexus/nexus-module-builder";
import { ModuleCompiler } from "./compiler/ModuleCompiler";
import { createAllDirectories } from "./init/InitDirectoryCreator";
import { createBrowserWindow } from "./init/Window";
import { getIPCCallback } from "./init/ModuleCommunication";



if (process.argv.includes("--dev")) {

} else {
    Menu.setApplicationMenu(null);
}

const moduleController: ModuleController = new ModuleController();
app.whenReady().then(() => {
    init();

    moduleController.start();
    app.on("activate", () => { // MacOS stuff
        if (BrowserWindow.getAllWindows().length === 0) {
            init();
            moduleController.start();
        }
    });
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});


async function init() {
    // Create all directories
    await createAllDirectories();

    // Get internal command line from file and append to process.argv
    const internalArguments: string[] = await getInternalArguments();
    for (const arg of internalArguments) {
        process.argv.push(arg);
    }

    const loadedModules: Process[] = await ModuleCompiler.load(internalArguments.includes("--force-reload"));
    const moduleMap: Map<string, Process> = new Map();
    const window: BrowserWindow = await createBrowserWindow();

    for (const module of loadedModules) {
        module.setIPC(getIPCCallback(window));
        registerModule(moduleMap, module);
    }
}


function registerModule(map: Map<string, Process>, module: Process) {
    const moduleID: string = module.getIPCSource();

    const existingIPCProcess: Process = map.get(moduleID);
    if (existingIPCProcess !== undefined) {
        console.error("WARNING: Modules with duplicate IDs have been found.");
        console.error(`ID: ${moduleID} | Registered Module: ${existingIPCProcess.getName()} | New Module: ${module.getName()}`);
        map.delete(moduleID);
        return;
    }
    map.set(moduleID, module);
    console.log("\tRegistering " + moduleID);

    ipcMain.handle(moduleID, (_, eventType: string, data: any = []) => {
        return module.handleEvent(eventType, data);
    });
}

function handleMainEvents() {
    ipcMain.handle(getIPCSource(), (_, eventType: string, data: any[]) => {
        switch (eventType) {
            case "renderer-init": {
                if (this.processReady) {
                    // this.init();
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

function getIPCSource(): string {
    return "built_ins.Main";
}


















