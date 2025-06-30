"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var electron_1 = require("electron");
var _a = require('electron'), ipcRenderer = _a.ipcRenderer, contextBridge = _a.contextBridge;
var PRELOAD_MODULE_ID = undefined;
function getModuleID() {
    if (!PRELOAD_MODULE_ID) {
        for (var _i = 0, _a = process.argv; _i < _a.length; _i++) {
            var arg = _a[_i];
            if (arg.toLocaleLowerCase().startsWith("--module-id")) {
                PRELOAD_MODULE_ID = arg.split(":").at(-1).toLocaleLowerCase();
                break;
            }
        }
    }
    if (PRELOAD_MODULE_ID === undefined) {
        throw new Error("Could not find module ID within renderers 'process.argv'.");
    }
    return PRELOAD_MODULE_ID;
}
contextBridge.exposeInMainWorld('ipc', {
    sendToProcess: function (eventType, data) { return ipcRenderer.invoke(getModuleID(), eventType, data); },
    onProcessEvent: function (func) {
        ipcRenderer.on(getModuleID(), function (_, eventName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return func.apply(void 0, __spreadArray([eventName], args, false));
        });
    },
    removeAllListeners: function () {
        ipcRenderer.removeAllListeners(getModuleID());
    }
});
contextBridge.exposeInMainWorld('webUtils', {
    getPathForFile: function (file) { return electron_1.webUtils.getPathForFile(file); }
});
// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
    args: __spreadArray([], process.argv, true)
});
//# sourceMappingURL=preload.js.map