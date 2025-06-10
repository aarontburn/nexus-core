"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.AutoUpdaterProcess = exports.UPDATER_MODULE_ID = void 0;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
var path = __importStar(require("path"));
var module_updater_1 = __importDefault(require("./module-updater"));
var notification_process_1 = require("../notification/notification-process");
var MODULE_NAME = "Nexus Auto Updater";
exports.UPDATER_MODULE_ID = 'nexus.Auto_Updater';
var AutoUpdaterProcess = /** @class */ (function (_super) {
    __extends(AutoUpdaterProcess, _super);
    function AutoUpdaterProcess(context) {
        var _this = _super.call(this, {
            moduleID: exports.UPDATER_MODULE_ID,
            moduleName: MODULE_NAME
        }) || this;
        _this.finishedChecking = false;
        _this.autoUpdaterStarted = false;
        _this.version = process.argv.includes("--dev") ? undefined : electron_1.app.getVersion();
        _this.moduleUpdater = new module_updater_1["default"](context);
        _this.context = context;
        _this.setModuleInfo({
            name: MODULE_NAME,
            id: exports.UPDATER_MODULE_ID,
            version: "1.0.0",
            author: "Nexus",
            description: "The Nexus auto-updater and module updater.",
            link: 'https://github.com/aarontburn/nexus-core',
            build: {
                "build-version": 0,
                process: ''
            },
            platforms: ['win32', 'darwin']
        });
        return _this;
    }
    AutoUpdaterProcess.prototype.beforeWindowCreated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestExternal("nexus.Settings", "get-setting", "check_module_updates")];
                    case 1:
                        if (!(_a.sent()).body) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.moduleUpdater.checkForAllUpdates()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.finishedChecking = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    AutoUpdaterProcess.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestExternal("nexus.Settings", "get-setting", "always_update")];
                    case 1:
                        if ((_a.sent()).body) {
                            this.startAutoUpdater();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AutoUpdaterProcess.prototype.startAutoUpdater = function () {
        var _this = this;
        if (process.argv.includes("--dev")) {
            console.info("[Nexus Auto Updater] You are in development; Nexus client updating is disabled.");
            return;
        }
        if (this.autoUpdaterStarted) {
            return;
        }
        this.autoUpdaterStarted = true;
        console.info("[Nexus Auto Updater] Current Nexus Version: " + this.version);
        console.info("[Nexus Auto Updater] Starting auto updater.");
        var TEN_MIN = 10 * 60 * 1000;
        if (process.argv.includes("--dev")) {
            electron_updater_1.autoUpdater.updateConfigPath = path.join(__dirname, '../../view/dev-app-update.yml');
            electron_updater_1.autoUpdater.forceDevUpdateConfig = true;
        }
        electron_updater_1.autoUpdater.autoInstallOnAppQuit = false;
        electron_updater_1.autoUpdater.autoDownload = false;
        electron_updater_1.autoUpdater.logger = null;
        electron_updater_1.autoUpdater.disableWebInstaller = true;
        var interval = undefined;
        electron_updater_1.autoUpdater.on('checking-for-update', function () {
            console.info("[Nexus Auto Updater] Checking for update...");
        });
        electron_updater_1.autoUpdater.on('update-available', function (info) {
            _this.requestExternal(notification_process_1.NOTIFICATION_MANAGER_ID, "open-dialog", {
                windowTitle: "Nexus Update Available",
                size: info.releaseNotes ? { width: 800, height: 500 } : { width: 500, height: 300 },
                markdownContentString: "\n\t\t\t\t\t\t<h2 align=\"center\">Nexus Update Available</h2>\n\n\t\t\t\t\t\t<p align=\"center\">You're currently using <strong>v".concat(electron_1.app.getVersion(), "</strong>.</p>\n\t\t\t\t\t\t<p align=\"center\">A newer version <strong>v").concat(info.version, "</strong> is available.</p>\n\t\t\t\t\t\t<p align=\"center\">Would you like to download it now?</p>\n\n\t\t\t\t\t\t").concat(info.releaseNotes
                    ? "\n\t\t\t\t\t\t\t\t<h3>Release Notes</h3>\n\t\t\t\t\t\t\t\t<div>".concat(info.releaseNotes, "</div>\n\t\t\t\t\t\t\t")
                    : '', "\n\n\t\t\t\t"),
                resolveAction: {
                    text: "Download Now",
                    action: function () {
                        electron_updater_1.autoUpdater.downloadUpdate();
                    }
                },
                rejectAction: {
                    text: "Later",
                    action: function () { }
                }
            });
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
            console.info("[Nexus Auto Updater] Release ".concat(event.version, " downloaded."));
            _this.requestExternal(notification_process_1.NOTIFICATION_MANAGER_ID, "open-dialog", {
                windowTitle: "Restart Required",
                size: { width: 500, height: 300 },
                markdownContentString: "\n\t\t\t\t\t<h2 align=\"center\">Nexus ".concat(event.version, " Downloaded</h2>\n\n\t\t\t\t\t<p align=\"center\">The latest version has been downloaded.</p>\n\t\t\t\t\t<p align=\"center\">Restart now to complete the update process.</p>\n\t\t\t\t"),
                resolveAction: {
                    text: "Restart Now",
                    action: function () {
                        electron_updater_1.autoUpdater.quitAndInstall();
                    }
                },
                rejectAction: {
                    text: "Later",
                    action: function () { }
                }
            });
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('update-cancelled', function (event) {
            console.info("[Nexus Auto Updater] Update cancelled.");
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('update-not-available', function (info) {
            console.info("[Nexus Auto Updater] No updates found. Current Version: ".concat(_this.version, " | Remote Version: ").concat(info.version));
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('error', function (err) {
            console.error("[Nexus Auto Updater] An error occurred while checking for updates: " + err.message);
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.checkForUpdates()["catch"](function () { }); // Ignore errors since this will be handled by the code above, i think?
        interval = setInterval(function () {
            electron_updater_1.autoUpdater.checkForUpdates()["catch"](function () { });
        }, TEN_MIN);
    };
    AutoUpdaterProcess.prototype.handleExternal = function (source, eventType, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, url, moduleID, downloadedSuccess, target, updateInfo, _d, code, message, force, moduleID, updateInfo, successful, _e, code, message;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _c = eventType;
                        switch (_c) {
                            case "install-module-from-git": return [3 /*break*/, 1];
                            case "check-for-update": return [3 /*break*/, 3];
                            case "get-all-updates": return [3 /*break*/, 7];
                            case "update-module": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 14];
                    case 1:
                        url = "https://" + data[0];
                        // input url must be in the format github.com/<owner>/<repo>/releases/latest/download/<module_id>.zip
                        // notice no https://, added in later
                        if (!url.startsWith("https://github.com/") || !url.includes("/releases/latest/download/") || !url.endsWith(".zip")) {
                            return [2 /*return*/, { code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST, body: new Error("Invalid link passed; link can only be in the format 'github.com/<owner>/<repo>/releases/latest/download/<module_id>.zip'") }];
                        }
                        moduleID = url.split("/").at(-1).replace(".zip", '');
                        return [4 /*yield*/, this.moduleUpdater.downloadLatest(moduleID, url)];
                    case 2:
                        downloadedSuccess = _f.sent();
                        if (downloadedSuccess) {
                            return [2 /*return*/, {
                                    code: nexus_module_builder_1.HTTPStatusCodes.OK, body: {
                                        moduleID: moduleID
                                    }
                                }];
                        }
                        else {
                            return [2 /*return*/, { code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST, body: "Could not download module from ".concat(url) }];
                        }
                        _f.label = 3;
                    case 3:
                        target = (_a = data[0]) !== null && _a !== void 0 ? _a : source.getIPCSource();
                        if (!this.context.moduleMap.has(target)) {
                            return [2 /*return*/, { body: new Error("No module with the ID of ".concat(target, " found.")), code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND }];
                        }
                        _f.label = 4;
                    case 4:
                        _f.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.moduleUpdater.checkForUpdate(target)];
                    case 5:
                        updateInfo = _f.sent();
                        return [2 /*return*/, { body: updateInfo, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    case 6:
                        _d = _f.sent();
                        code = _d.code, message = _d.message;
                        return [2 /*return*/, { body: message, code: code }];
                    case 7:
                        {
                            if (this.finishedChecking) {
                                return [2 /*return*/, { body: this.moduleUpdater.getAvailableUpdates(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                            }
                            return [2 /*return*/, new Promise(function (resolve) {
                                    var timeoutMS = 10000;
                                    var intervalMS = 500;
                                    var timeout = setTimeout(function () {
                                        clearInterval(interval);
                                        resolve({ body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.LOCKED });
                                    }, timeoutMS);
                                    var interval = setInterval(function () {
                                        if (_this.finishedChecking) {
                                            clearTimeout(timeout);
                                            clearInterval(interval);
                                            resolve({ body: _this.moduleUpdater.getAvailableUpdates(), code: nexus_module_builder_1.HTTPStatusCodes.OK });
                                        }
                                    }, intervalMS);
                                })];
                        }
                        _f.label = 8;
                    case 8:
                        force = data[0] === "force";
                        moduleID = (_b = data[1]) !== null && _b !== void 0 ? _b : source.getIPCSource();
                        if (!this.context.moduleMap.has(moduleID)) {
                            return [2 /*return*/, { body: new Error("No module with the ID of ".concat(moduleID, " found.")), code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND }];
                        }
                        _f.label = 9;
                    case 9:
                        _f.trys.push([9, 13, , 14]);
                        return [4 /*yield*/, this.moduleUpdater.getLatestRemoteVersion(moduleID)];
                    case 10:
                        updateInfo = _f.sent();
                        if (updateInfo === undefined) {
                            return [2 /*return*/, { body: "No latest releases found for " + moduleID, code: nexus_module_builder_1.HTTPStatusCodes.NO_CONTENT }];
                        }
                        if (!(force || this.moduleUpdater.compareSemanticVersion(updateInfo.latestVersion, updateInfo.currentVersion) === 1)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.moduleUpdater.downloadLatest(moduleID, updateInfo.url)];
                    case 11:
                        successful = _f.sent();
                        if (!successful) {
                            return [2 /*return*/, { body: new Error("An error occurred while updating ".concat(moduleID)), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                        }
                        _f.label = 12;
                    case 12: return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    case 13:
                        _e = _f.sent();
                        code = _e.code, message = _e.message;
                        return [2 /*return*/, { body: message, code: code }];
                    case 14:
                        {
                            return [2 /*return*/, { code: nexus_module_builder_1.HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined }];
                        }
                        _f.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return AutoUpdaterProcess;
}(nexus_module_builder_1.Process));
exports.AutoUpdaterProcess = AutoUpdaterProcess;
//# sourceMappingURL=updater-process.js.map