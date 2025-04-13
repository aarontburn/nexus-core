"use strict";
exports.__esModule = true;
exports.interactWithExternalModules = void 0;
function interactWithExternalModules(context) {
    var source = context.mainIPCSource;
    context.ipcCallback.requestExternalModule(source, "aarontburn.Debug_Console", "addCommandPrefix", {
        prefix: "installed-modules",
        executeCommand: function (args) {
            console.info(Array.from(context.moduleMap.keys()));
        },
        documentation: {
            shortDescription: "Lists IDs of all installed modules."
        }
    });
}
exports.interactWithExternalModules = interactWithExternalModules;
//# sourceMappingURL=external-module-interfacer.js.map