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
        return ipcRenderer.on(id, func);
    }
});
// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
    args: process.argv
});
//# sourceMappingURL=preload.js.map