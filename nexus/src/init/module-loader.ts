import { Process, ModuleSettings, Setting, DIRECTORIES } from "@nexus/nexus-module-builder";
import { ipcMain } from "electron";
import { InitContext } from "../utils/types";
import { ModuleCompiler } from "../compiler/module-compiler";
import { getIPCCallback } from "./global-event-handler";
import { HomeProcess } from "../internal-modules/home/HomeProcess";
import { SettingsProcess } from "../internal-modules/settings/process/SettingsProcess";
import { AutoUpdaterProcess } from "../internal-modules/auto-updater/updater-process";
import * as fs from "fs";
import * as path from "path";



export async function loadModules(context: InitContext): Promise<Map<string, Process>> {
    // Load modules from storage
    const loadedModules: Process[] = await ModuleCompiler.load(process.argv.includes("--force-reload"));

    const settingProcess: SettingsProcess = new SettingsProcess();
    const internalModules: Process[] = [new HomeProcess(), settingProcess, new AutoUpdaterProcess()];

    // Register all modules
    const moduleMap: Map<string, Process> = new Map();
    for (const module of [...internalModules, ...loadedModules]) {
        module.setIPC(getIPCCallback(context));
        registerModule(moduleMap, module);
    }



    const moduleOrder: string = settingProcess.getSettings()
        .findSetting("module_order")
        .getValue() as string;
    const reorderedModules: Process[] = reorderModules(moduleOrder, loadedModules);

    // Write new order
    await settingProcess
        .getSettings()
        .findSetting('module_order')
        .setValue(loadedModules.map(module => module.getID()).join("|"));

    const orderedMap: Map<string, Process> = new Map();
    for (const module of [...internalModules, ...reorderedModules]) {
        orderedMap.set(module.getIPCSource(), module);
    }
    return orderedMap;

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

function reorderModules(idOrderUnparsed: string, moduleList: Process[]): Process[] {
    if (idOrderUnparsed === '') { // no order set, return the original list
        return moduleList;
    }

    const idOrder: string[] = idOrderUnparsed.split("|");
    const reorderedModules: Process[] = [];
    const moduleMap = moduleList.reduce((map: Map<string, Process>, module: Process) => {
        if (map.has(module.getID())) { // duplicate module found, ignore both of them
            console.error("WARNING: Modules with duplicate IDs have been found.");
            console.error(`ID: ${module.getID()} | Registered Module: ${map.get(module.getID()).getName()} | New Module: ${module.getName()}`);
            map.delete(module.getID());

        } else {
            map.set(module.getID(), module);
        }

        return map;
    }, new Map<string, Process>());

    for (const moduleID of idOrder) {
        if (moduleMap.has(moduleID)) {
            reorderedModules.push(moduleMap.get(moduleID));
            moduleMap.delete(moduleID)
        }
    }

    for (const leftoverModule of Array.from(moduleMap.values())) {
        reorderedModules.push(leftoverModule);
    }

    return reorderedModules;
}