var _a = require('electron'), ipcRenderer = _a.ipcRenderer, contextBridge = _a.contextBridge;
contextBridge.exposeInMainWorld('ipc', {
    send: function (target, eventType, data) {
        return ipcRenderer.invoke(target, eventType, data);
    },
    on: function (channel, func) {
        return ipcRenderer.on(channel, func);
    }
});
// Note: This differs from process.argv in the process and has renderer information.
contextBridge.exposeInMainWorld("common", {
    args: process.argv
});
//# sourceMappingURL=preload.js.map