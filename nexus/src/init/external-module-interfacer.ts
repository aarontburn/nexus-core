import { IPCSource } from "@nexus/nexus-module-builder";
import { InitContext } from "../utils/types";


export function interactWithExternalModules(context: InitContext) {
    const source: IPCSource = context.mainIPCSource;

    context.ipcCallback.requestExternalModule(source, "aarontburn.Debug_Console", "addCommandPrefix", {
        prefix: "installed-modules",
        executeCommand: (args: string[]) => {
            console.info(Array.from(context.moduleMap.keys()))
        },
        documentation: {
            shortDescription: "Lists IDs of all installed modules."
        }
    })
}
