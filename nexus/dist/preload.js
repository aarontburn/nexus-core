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
        // const id = rendererWindow.frameElement?.id ?? (rendererWindow as any)["INTERNAL_ID_DO_NOT_USE"];
        for (var _i = 0, _a = rendererWindow.common.args; _i < _a.length; _i++) {
            var arg = _a[_i];
            if (arg.startsWith("--module-id")) {
                console.log(arg.split(":").at(-1));
                return ipcRenderer.invoke(arg.split(":").at(-1), eventType, data);
            }
        }
        console.log("Couldn't find id");
        console.log(rendererWindow);
    },
    on: function (rendererWindow, func) {
        // const id = rendererWindow.frameElement?.id ?? (rendererWindow as any)["INTERNAL_ID_DO_NOT_USE"];
        for (var _i = 0, _a = rendererWindow.common.args; _i < _a.length; _i++) {
            var arg = _a[_i];
            if (arg.startsWith("--module-id")) {
                console.log(arg.split(":").at(-1));
                return ipcRenderer.on(arg.split(":").at(-1), function (_, eventName) {
                    var args = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args[_i - 2] = arguments[_i];
                    }
                    return func.apply(void 0, __spreadArray([eventName], args, false));
                });
            }
        }
        console.log("Couldn't find id");
        console.log(rendererWindow);
    }
});
// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
    args: process.argv
});
//# sourceMappingURL=preload.js.map