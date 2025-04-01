"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var ModuleController_1 = require("./ModuleController");
var moduleController = new ModuleController_1.ModuleController();
// Menu.setApplicationMenu(null);
electron_1.app.whenReady().then(function () {
    moduleController.start();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            moduleController.start();
        }
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map