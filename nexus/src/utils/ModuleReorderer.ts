import { Process } from "@nexus/nexus-module-builder"


export const reorderModules = (idOrderUnparsed: string, moduleList: Process[]): Process[] => {
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