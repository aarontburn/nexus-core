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
exports.startAutoUpdater = void 0;
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
var path = __importStar(require("path"));
function startAutoUpdater() {
    console.info("[Nexus Auto Updater] Current Nexus Version: " + electron_1.app.getVersion());
    console.info("[Nexus Auto Updater] Starting auto updater.");
    var TEN_MIN = 10 * 60 * 1000;
    if (process.argv.includes("--dev")) {
        electron_updater_1.autoUpdater.autoDownload = false;
        electron_updater_1.autoUpdater.autoInstallOnAppQuit = false;
        electron_updater_1.autoUpdater.updateConfigPath = path.join(__dirname, '../view/dev-app-update.yml');
        electron_updater_1.autoUpdater.forceDevUpdateConfig = true;
    }
    electron_updater_1.autoUpdater.logger = null;
    electron_updater_1.autoUpdater.disableWebInstaller = true;
    var interval = undefined;
    electron_updater_1.autoUpdater.on('checking-for-update', function () {
        console.info("[Nexus Auto Updater] Checking for update...");
    });
    electron_updater_1.autoUpdater.on('update-available', function (info) {
        var out = [];
        out.push("[Nexus Auto Updater] Update Found:");
        if (info.releaseName) {
            out.push("\tRelease Name: ".concat(info.releaseName));
        }
        out.push("\tRelease Date: ".concat(info.releaseDate.split("T")[0]));
        out.push("\tVersion: ".concat(electron_1.app.getVersion(), " => ").concat(info.version));
        if (info.releaseNotes) {
            out.push("\tRelease Notes: ".concat(info.releaseNotes));
        }
        console.info("\n" + out.join("\n") + "\n");
        clearInterval(interval);
    });
    electron_updater_1.autoUpdater.on('update-downloaded', function (event) {
        console.info("[Nexus Auto Updater]: Release ".concat(event.version, " downloaded. This will be installed on next launch."));
        clearInterval(interval);
    });
    electron_updater_1.autoUpdater.on('update-cancelled', function (event) {
        console.info("[Nexus Auto Updater]: Update cancelled.");
        clearInterval(interval);
    });
    electron_updater_1.autoUpdater.on('error', function (err) {
        console.error("[Nexus Auto Updater]: An error occurred while checking for updates: " + err.message);
        clearInterval(interval);
    });
    electron_updater_1.autoUpdater.checkForUpdates()["catch"](function () { }); // Ignore errors since this will be handled by the code above, i think?
    interval = setInterval(function () {
        electron_updater_1.autoUpdater.checkForUpdates()["catch"](function () { });
    }, TEN_MIN);
}
exports.startAutoUpdater = startAutoUpdater;
//# sourceMappingURL=auto-update.js.map