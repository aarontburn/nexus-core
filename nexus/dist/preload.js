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
contextBridge.exposeInMainWorld('ipc', {
    send: function (rendererWindow, eventType, data) {
        var _a, _b;
        var id = (_b = (_a = rendererWindow.frameElement) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : rendererWindow["INTERNAL_ID_DO_NOT_USE"];
        return ipcRenderer.invoke(id, eventType, data);
    },
    on: function (rendererWindow, func) {
        var _a, _b;
        var id = (_b = (_a = rendererWindow.frameElement) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : rendererWindow["INTERNAL_ID_DO_NOT_USE"];
        return ipcRenderer.on(id, function (_, eventName) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return func.apply(void 0, __spreadArray([eventName], args, false));
        });
    }
});
// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
    args: process.argv
});
//# sourceMappingURL=preload.js.map