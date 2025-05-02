var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a = require('electron'), ipcRenderer = _a.ipcRenderer, contextBridge = _a.contextBridge;
var moduleID = undefined;
contextBridge.exposeInMainWorld('ipc', {
    send: function (rendererWindow, eventType, data) {
        if (!moduleID) {
            for (var _i = 0, _a = rendererWindow.common.args; _i < _a.length; _i++) {
                var arg = _a[_i];
                if (arg.startsWith("--module-id")) {
                    moduleID = arg.split(":").at(-1);
                    break;
                }
            }
        }
        return ipcRenderer.invoke(moduleID, eventType, data);
    },
    on: function (rendererWindow, func) {
        if (!moduleID) {
            for (var _i = 0, _a = rendererWindow.common.args; _i < _a.length; _i++) {
                var arg = _a[_i];
                if (arg.startsWith("--module-id")) {
                    moduleID = arg.split(":").at(-1);
                    break;
                }
            }
        }
        ipcRenderer.on(moduleID, function (_, eventName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return func.apply(void 0, __spreadArray([eventName], args, false));
        });
    },
    removeAllListeners: function (rendererWindow) {
        if (!moduleID) {
            for (var _i = 0, _a = rendererWindow.common.args; _i < _a.length; _i++) {
                var arg = _a[_i];
                if (arg.startsWith("--module-id")) {
                    moduleID = arg.split(":").at(-1);
                    break;
                }
            }
        }
        ipcRenderer.removeAllListeners(moduleID);
    }
});
// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
    args: process.argv
});
//# sourceMappingURL=preload.js.map