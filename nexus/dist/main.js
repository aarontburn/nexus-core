"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var electron_1 = require("electron");
var ModuleController_1 = require("./ModuleController");
var os = __importStar(require("os"));
var fs = __importStar(require("fs"));
var checkLastCompiledModule = function () {
    var DEV_PATH = os.homedir() + "/.nexus_dev/dev.json";
    try {
        var devJSON = JSON.parse(fs.readFileSync(DEV_PATH, "utf-8"));
        if (devJSON["last_exported_id"]) {
            process.argv.push("--last_exported_id:".concat(devJSON["last_exported_id"]));
        }
        fs.rmSync(DEV_PATH);
    }
    catch (_) {
    }
};
if (process.argv.includes("--dev")) {
    checkLastCompiledModule();
}
else {
    electron_1.Menu.setApplicationMenu(null);
}
var moduleController = new ModuleController_1.ModuleController();
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