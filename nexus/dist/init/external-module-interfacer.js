"use strict";
exports.__esModule = true;
exports.interactWithExternalModules = void 0;
function interactWithExternalModules(context) {
    var source = context.mainIPCSource;
    context.ipcCallback.requestExternalModule(source, "aarontburn.Debug_Console", "addCommandPrefix", {
        prefix: "installed-modules",
        executeCommand: function (args) {
            var out = [];
            context.moduleMap.forEach(function (process, id) {
                if (args.includes("--internal")) {
                    if (!process.getHTMLPath() && !process.getURL()) {
                        out.push("\t".concat(process.getName(), " (").concat(process.getID(), ")"));
                    }
                }
                else if (args.includes("--external")) {
                    if (process.getHTMLPath() || process.getURL()) {
                        out.push("\t".concat(process.getName(), " (").concat(process.getID(), ")"));
                    }
                }
                else {
                    out.push("\t".concat(process.getName(), " (").concat(process.getID(), ")"));
                }
            });
            console.info("\n" + out.join("\n") + "\n");
        },
        documentation: {
            shortDescription: "Lists IDs of all installed modules.",
            longDescription: "\nUsage: installed-modules [--internal | --external]\n\n        - Prints the name and ID of all installed modules.\n        - By including the flag '--internal', only internal (no-GUI) modules will be displayed.\n        - By including the flag '--external', only external (GUI) modules will be displayed.\n\n        Example: Display all installed modules.\n        >> installed-modules\n\n        Example: Display all installed, internal modules.\n        >> installed-modules --internal"
        }
    });
}
exports.interactWithExternalModules = interactWithExternalModules;
//# sourceMappingURL=external-module-interfacer.js.map