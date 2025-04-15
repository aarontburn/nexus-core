import { Process, StorageHandler, ModuleSettings, Setting } from "@nexus/nexus-module-builder";
import { ipcMain } from "electron";
import { InitContext } from "../utils/types";
import { ModuleCompiler } from "../compiler/module-compiler";
import { getIPCCallback } from "./global-event-handler";
import { HomeProcess } from "../built_ins/home_module/HomeProcess";
import { SettingsProcess } from "../built_ins/settings_module/process/SettingsProcess";



export async function loadModules(context: InitContext): Promise<Map<string, Process>> {
    // Load modules from storage
    const loadedModules: Process[] = await ModuleCompiler.load(process.argv.includes("--force-reload"));
    const [homeProcess, settingProcess] = [new HomeProcess(), new SettingsProcess()]


    // Register all modules
    const moduleMap: Map<string, Process> = new Map();
    for (const module of [homeProcess, settingProcess, ...loadedModules]) {
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
    await StorageHandler.writeModuleSettingsToStorage(settingProcess);

    const orderedMap: Map<string, Process> = new Map();
    for (const module of [homeProcess, settingProcess, ...reorderedModules]) {
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
    const settingsMap: Map<string, any> = await StorageHandler.readSettingsFromModuleStorage(module);
    const moduleSettings: ModuleSettings = module.getSettings();

    const result = await Promise.allSettled(Array.from(settingsMap).map(async ([settingName, settingValue]) => {
        if (settingName === "Startup Module ID") {
            console.log("initial: " + settingValue)
        }


        const setting: Setting<unknown> = moduleSettings.findSetting(settingName);
        if (setting === undefined) {
            console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
        } else {
            await setting.setValue(settingValue);
        }

        if (settingName === "Startup Module ID") {
            console.log("after: " + setting.getValue())
        }
    }))
    console.log(result)
    await StorageHandler.writeModuleSettingsToStorage(module);
    return module;
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