import { IPCSource, Process } from "@nexus-app/nexus-module-builder";
import { InitContext } from "../utils/types";


export function interactWithExternalModules(context: InitContext) {
    const source: IPCSource = context.mainIPCSource;

    context.ipcCallback.requestExternalModule(source, "aarontburn.Debug_Console", "addCommandPrefix", {
        prefix: "installed-modules",
        executeCommand: (args: string[]) => {
            const out: string[] = [];

            context.moduleMap.forEach((process: Process, id: string) => {
                if (args.includes("--internal")) {
                    if (!process.getHTMLPath() && !process.getURL()) {
                        out.push(`\t${process.getName()} (${process.getID()})`);
                    }
                } else if (args.includes("--external")) {
                    if (process.getHTMLPath() || process.getURL()) {
                        out.push(`\t${process.getName()} (${process.getID()})`);
                    }
                } else {
                    out.push(`\t${process.getName()} (${process.getID()})`);
                }
            });
            console.info("\n" + out.join("\n") + "\n");


        },
        documentation: {
            shortDescription: "Lists IDs of all installed modules.",
            longDescription: `
Usage: installed-modules [--internal | --external]

        - Prints the name and ID of all installed modules.
        - By including the flag '--internal', only internal (no-GUI) modules will be displayed.
        - By including the flag '--external', only external (GUI) modules will be displayed.

        Example: Display all installed modules.
        >> installed-modules

        Example: Display all installed, internal modules.
        >> installed-modules --internal`
        }
    })
}
