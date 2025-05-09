import { Process, ModuleSettings, Setting, DIRECTORIES } from "@nexus-app/nexus-module-builder";
import { ipcMain } from "electron";
import { InitContext } from "../utils/types";
import { ModuleCompiler } from "../compiler/module-compiler";
import { getIPCCallback } from "./global-event-handler";
import { HomeProcess, MODULE_ID as HOME_ID } from "../internal-modules/home/HomeProcess";
import { MODULE_ID as SettingID, SettingsProcess } from "../internal-modules/settings/process/SettingsProcess";
import { AutoUpdaterProcess, MODULE_ID as AutoUpdaterID } from "../internal-modules/auto-updater/updater-process";
import * as fs from "fs";
import * as path from "path";


const INTERNAL_MODULE_IDS = [SettingID, AutoUpdaterID, HOME_ID]

export async function loadModules(context: InitContext): Promise<Map<string, Process>> {
    // Load modules from storage
    const loadedModules: Process[] = await ModuleCompiler.load(process.argv.includes("--force-reload"));

    const settingProcess: SettingsProcess = new SettingsProcess();
    const internalModules: Process[] = [new HomeProcess(), new AutoUpdaterProcess(context), settingProcess];

    // Register all modules
    const moduleMap: Map<string, Process> = new Map();
    for (const module of [...internalModules, ...loadedModules]) {
        module.setIPC(getIPCCallback(context));
        registerModule(moduleMap, module);
    }
    return moduleMap;
}



function registerModule(map: Map<string, Process>, module: Process) {
    const moduleID: string = module.getIPCSource();

    const existingIPCProcess: Process = map.get(moduleID);
    if (existingIPCProcess !== undefined) {
        console.error("WARNING: Modules with duplicate IDs have been found.");
        console.error(`ID: ${moduleID} | Registered Module: ${existingIPCProcess.getName()} | New Module: ${module.getName()}`);

        if (!INTERNAL_MODULE_IDS.includes(moduleID)) { // dont delete built-in modules, just skip it
            map.delete(moduleID); // remove existing module
        }
        return;
    }
    map.set(moduleID, module);
    console.log("\tRegistering " + moduleID);

    ipcMain.handle(moduleID.toLowerCase(), (_, eventType: string, data: any = []) => {
        return module.handleEvent(eventType, data);
    });
}

export async function verifyAllModuleSettings(context: InitContext) {
    // Register all settings
    for (const module of Array.from(context.moduleMap.values())) {
        context.settingModule.addModuleSetting(await verifyModuleSettings(module));
    }
}


async function verifyModuleSettings(module: Process): Promise<Process> {
    const settingsMap: Map<string, any> = await readSettingsFromModuleStorage(module);
    const moduleSettings: ModuleSettings = module.getSettings();

    await Promise.allSettled(Array.from(settingsMap).map(async ([settingName, settingValue]) => {
        const setting: Setting<unknown> = moduleSettings.findSetting(settingName);
        if (setting === undefined) {
            console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
        } else {
            await setting.setValue(settingValue);
        }
    }))


    await writeModuleSettingsToStorage(module);
    return module;
}

export async function writeModuleSettingsToStorage(module: Process): Promise<void> {
    const settingMap: Map<string, any> = new Map();

    module.getSettings().allToArray().forEach((setting: Setting<unknown>) => {
        settingMap.set(setting.getName(), setting.getValue());
    });

    const folderName: string = path.join(
        DIRECTORIES.MODULE_STORAGE_PATH,
        module.getIPCSource(),
        "/",
    )
    const filePath: string = folderName + getModuleSettingsName(module);

    await fs.promises.mkdir(folderName, { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(Object.fromEntries(settingMap), undefined, 4));
}


async function readSettingsFromModuleStorage(module: Process): Promise<Map<string, any>> {
    const settingMap: Map<string, any> = new Map();

    const folderName: string = path.join(
        DIRECTORIES.MODULE_STORAGE_PATH,
        module.getIPCSource(),
        "/",
        getModuleSettingsName(module)
    )

    let contents: string;
    try {
        contents = await fs.promises.readFile(folderName, 'utf-8');
    } catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }
        return settingMap;
    }

    try {
        const json: any = JSON.parse(contents);
        for (const settingName in json) {
            settingMap.set(settingName, json[settingName]);
        }
    } catch (err) {
        console.error("Error parsing JSON for setting: " + module.getName())
    }

    return settingMap;
}


function getModuleSettingsName(module: Process): string {
    return module.getName().toLowerCase() + "_settings.json";
}