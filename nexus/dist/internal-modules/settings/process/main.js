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
exports.SettingsProcess = exports.MODULE_ID = void 0;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var electron_1 = require("electron");
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var module_importer_1 = require("./module-importer");
var settings_1 = require("./settings");
var module_loader_1 = require("../../../init/module-loader");
var handle_external_1 = __importDefault(require("./handle-external"));
var updater_process_1 = require("../../auto-updater/updater-process");
var internal_args_1 = require("../../../init/internal-args");
var notification_process_1 = require("../../notification/notification-process");
var MODULE_NAME = "Settings";
exports.MODULE_ID = 'nexus.Settings';
var HTML_PATH = path.join(__dirname, "../static/SettingsHTML.html");
var ICON_PATH = path.join(__dirname, "../static/setting.svg");
var SettingsProcess = /** @class */ (function (_super) {
    __extends(SettingsProcess, _super);
    function SettingsProcess() {
        var _this = _super.call(this, {
            moduleID: exports.MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                htmlPath: HTML_PATH,
                iconPath: ICON_PATH
            }
        }) || this;
        _this.moduleSettingsList = new Map();
        _this.deletedModules = [];
        _this.availableUpdates = {};
        _this.getSettings().setDisplayName("General");
        _this.setModuleInfo({
            name: "General Settings",
            id: exports.MODULE_ID,
            version: "1.0.0",
            author: "Nexus",
            link: 'https://github.com/aarontburn/nexus-core',
            description: "General settings that control the Nexus client.",
            build: {
                "build-version": 0,
                process: ''
            }
        });
        return _this;
    }
    SettingsProcess.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                _super.prototype.initialize.call(this);
                this.sendToRenderer("is-dev", this.getSettings().findSetting('dev_mode').getValue());
                this.populateSettingsList();
                this.requestExternal(updater_process_1.MODULE_ID, "get-all-updates").then(function (response) {
                    if (response.code === nexus_module_builder_1.HTTPStatusCodes.OK) {
                        _this.availableUpdates = response.body;
                    }
                });
                this.requestExternal("aarontburn.Debug_Console", "addCommandPrefix", {
                    prefix: "open-settings",
                    documentation: {
                        shortDescription: "Opens the settings associated with a module."
                    },
                    executeCommand: function (args) {
                        _this.handleExternal(_this, 'open-settings-for-module', [args[1]]).then(console.log);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    SettingsProcess.prototype.registerSettings = function () {
        return (0, settings_1.getSettings)(this);
    };
    SettingsProcess.prototype.registerInternalSettings = function () {
        return (0, settings_1.getInternalSettings)(this);
    };
    SettingsProcess.prototype.onSettingModified = function (modifiedSetting) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, settings_1.onSettingModified)(this, modifiedSetting)];
            });
        });
    };
    SettingsProcess.prototype.handleExternal = function (source, eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, handle_external_1["default"])(this, source, eventType, data)];
            });
        });
    };
    SettingsProcess.prototype.populateSettingsList = function () {
        var settings = [];
        for (var _i = 0, _a = Array.from(this.moduleSettingsList.values()); _i < _a.length; _i++) {
            var moduleSettings = _a[_i];
            var moduleSettingsDisplayName = moduleSettings.getDisplayName();
            var list = {
                moduleSettingsName: moduleSettingsDisplayName,
                moduleID: moduleSettings.getProcess().getIPCSource(),
                moduleInfo: moduleSettings.getProcess().getModuleInfo()
            };
            if (moduleSettings.allToArray().length !== 0) {
                settings.push(list);
            }
            moduleSettings.getProcess().refreshAllSettings();
        }
        // Swap settings and home module so it appears at the top
        if (settings[0].moduleSettingsName === "Home") {
            var temp = settings[0];
            settings[0] = settings[1];
            settings[1] = temp;
        }
        this.sendToRenderer("populate-settings-list", settings);
    };
    SettingsProcess.prototype.onExit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var window, isWindowMaximized, bounds, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        window = electron_1.BaseWindow.getAllWindows()[0];
                        isWindowMaximized = window.isMaximized();
                        bounds = window.getBounds();
                        _b = (_a = Promise).allSettled;
                        _c = [this.getSettings().findSetting('window_maximized').setValue(isWindowMaximized),
                            this.getSettings().findSetting('window_width').setValue(bounds.width),
                            this.getSettings().findSetting('window_height').setValue(bounds.height),
                            this.getSettings().findSetting('window_x').setValue(bounds.x),
                            this.getSettings().findSetting('window_y').setValue(bounds.y)];
                        _e = (_d = this.getSettings().findSetting('startup_last_open_id')).setValue;
                        return [4 /*yield*/, this.requestExternal("nexus.Main", "get-current-module-id")];
                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                                _e.apply(_d, [(_f.sent()).body])
                            ])])];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, this.fileManager.writeSettingsToStorage()];
                    case 3:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // TODO: Restructure stuff 
    SettingsProcess.prototype.onSettingChange = function (settingID, newValue) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, moduleSettings, settingsList, _b, settingsList_1, setting, settingBox, _c, _d, group, id, oldValue, update;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _i = 0, _a = Array.from(this.moduleSettingsList.values());
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        moduleSettings = _a[_i];
                        settingsList = moduleSettings.allToArray();
                        _b = 0, settingsList_1 = settingsList;
                        _e.label = 2;
                    case 2:
                        if (!(_b < settingsList_1.length)) return [3 /*break*/, 11];
                        setting = settingsList_1[_b];
                        settingBox = setting.getUIComponent();
                        _c = 0, _d = settingBox.getInputIdAndType();
                        _e.label = 3;
                    case 3:
                        if (!(_c < _d.length)) return [3 /*break*/, 10];
                        group = _d[_c];
                        id = group.id;
                        if (!(id === settingID)) return [3 /*break*/, 9];
                        oldValue = setting.getValue();
                        if (!(newValue === undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, setting.resetToDefault()];
                    case 4:
                        _e.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, setting.setValue(newValue)];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7:
                        setting.getParentModule().onSettingModified(setting);
                        console.info("[Nexus Settings] Setting changed: '".concat(setting.getName(), "' | ").concat(oldValue, " => ").concat(setting.getValue(), " ").concat(newValue === undefined ? '[RESET TO DEFAULT]' : ''));
                        update = settingBox.onChange(setting.getValue());
                        this.sendToRenderer("setting-modified", update);
                        return [4 /*yield*/, (0, module_loader_1.writeModuleSettingsToStorage)(setting.getParentModule())];
                    case 8:
                        _e.sent();
                        return [2 /*return*/];
                    case 9:
                        _c++;
                        return [3 /*break*/, 3];
                    case 10:
                        _b++;
                        return [3 /*break*/, 2];
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SettingsProcess.prototype.swapSettingsTab = function (targetModuleID) {
        for (var _i = 0, _a = Array.from(this.moduleSettingsList.values()); _i < _a.length; _i++) {
            var moduleSettings = _a[_i];
            if (targetModuleID !== moduleSettings.getProcess().getIPCSource()) {
                continue;
            }
            var settingsList = moduleSettings.getSettingsAndHeaders();
            var list = {
                moduleName: moduleSettings.getDisplayName(),
                moduleID: moduleSettings.getProcess().getIPCSource(),
                moduleInfo: moduleSettings.getProcess().getModuleInfo(),
                settings: []
            };
            for (var _b = 0, settingsList_2 = settingsList; _b < settingsList_2.length; _b++) {
                var s = settingsList_2[_b];
                if (typeof s === 'string') {
                    list.settings.push(s);
                    continue;
                }
                var setting = s;
                var settingBox = setting.getUIComponent();
                var settingInfo = {
                    settingId: setting.getID(),
                    inputTypeAndId: settingBox.getInputIdAndType(),
                    ui: settingBox.getUI(),
                    style: [settingBox.constructor.name + 'Styles', settingBox.getStyle()]
                };
                list.settings.push(settingInfo);
            }
            return list;
        }
    };
    SettingsProcess.prototype.handleEvent = function (eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, body_1, rejectText_1, resolveText_1, moduleID_1, response, moduleID, response, moduleID_2, moduleID_3, info, err_1, elementId, elementValue, settingId, link, moduleOrder;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = eventType;
                        switch (_a) {
                            case "settings-init": return [3 /*break*/, 1];
                            case "open-popup": return [3 /*break*/, 2];
                            case "update-module": return [3 /*break*/, 3];
                            case "check-for-update": return [3 /*break*/, 5];
                            case "force-reload-module": return [3 /*break*/, 7];
                            case 'open-module-folder': return [3 /*break*/, 8];
                            case 'import-module': return [3 /*break*/, 9];
                            case 'manage-modules': return [3 /*break*/, 11];
                            case 'remove-module': return [3 /*break*/, 13];
                            case 'restart-now': return [3 /*break*/, 18];
                            case "swap-settings-tab": return [3 /*break*/, 19];
                            case "setting-modified": return [3 /*break*/, 20];
                            case 'setting-reset': return [3 /*break*/, 21];
                            case 'open-link': return [3 /*break*/, 22];
                            case "module-order": return [3 /*break*/, 23];
                        }
                        return [3 /*break*/, 26];
                    case 1:
                        {
                            this.initialize();
                            return [3 /*break*/, 27];
                        }
                        _c.label = 2;
                    case 2:
                        {
                            _b = data[0], body_1 = _b.body, rejectText_1 = _b.rejectText, resolveText_1 = _b.resolveText;
                            return [2 /*return*/, new Promise(function (resolve) {
                                    _this.requestExternal(notification_process_1.NOTIFICATION_MANAGER_ID, "open-dialog", {
                                        windowTitle: "Nexus Settings",
                                        markdownContentString: body_1,
                                        size: { width: 500, height: 300 },
                                        rejectAction: {
                                            text: rejectText_1,
                                            action: function () {
                                                resolve(false);
                                            }
                                        },
                                        resolveAction: {
                                            text: resolveText_1,
                                            action: function () {
                                                resolve(true);
                                            }
                                        }
                                    });
                                })];
                        }
                        _c.label = 3;
                    case 3:
                        moduleID_1 = data[0];
                        return [4 /*yield*/, this.requestExternal(updater_process_1.MODULE_ID, "update-module", undefined, moduleID_1)];
                    case 4:
                        response = _c.sent();
                        if (response.code !== nexus_module_builder_1.HTTPStatusCodes.OK) {
                            return [2 /*return*/, false];
                        }
                        (0, internal_args_1.readInternal)().then(internal_args_1.parseInternalArgs).then(function (args) {
                            if (!args.includes("--force-reload-module:" + moduleID_1)) {
                                args.push("--force-reload-module:" + moduleID_1);
                            }
                            return (0, internal_args_1.writeInternal)(args);
                        });
                        return [2 /*return*/, true];
                    case 5:
                        moduleID = data[0];
                        return [4 /*yield*/, this.requestExternal("nexus.Auto_Updater", "check-for-update", moduleID)];
                    case 6:
                        response = _c.sent();
                        if (response.code === nexus_module_builder_1.HTTPStatusCodes.OK && response.body !== undefined) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 7:
                        {
                            moduleID_2 = data[0];
                            console.info("[Nexus Settings] Force reloading ".concat(moduleID_2, " on next launch."));
                            (0, internal_args_1.readInternal)().then(internal_args_1.parseInternalArgs).then(function (args) {
                                if (!args.includes("--force-reload-module:" + moduleID_2)) {
                                    args.push("--force-reload-module:" + moduleID_2);
                                }
                                return (0, internal_args_1.writeInternal)(args);
                            });
                            return [3 /*break*/, 27];
                        }
                        _c.label = 8;
                    case 8:
                        {
                            moduleID_3 = data[0];
                            electron_1.shell.openPath(path.normalize(nexus_module_builder_1.DIRECTORIES.MODULE_STORAGE_PATH + moduleID_3)).then(function (result) {
                                if (result !== '') {
                                    throw new Error('Could not find folder: ' + path.normalize(nexus_module_builder_1.DIRECTORIES.MODULE_STORAGE_PATH + moduleID_3));
                                }
                            });
                            return [3 /*break*/, 27];
                        }
                        _c.label = 9;
                    case 9: return [4 /*yield*/, (0, module_importer_1.importModuleArchive)()];
                    case 10: return [2 /*return*/, _c.sent()];
                    case 11: return [4 /*yield*/, (0, module_importer_1.getImportedModules)(this, this.availableUpdates, this.deletedModules)];
                    case 12: return [2 /*return*/, _c.sent()];
                    case 13:
                        info = data[0];
                        _c.label = 14;
                    case 14:
                        _c.trys.push([14, 16, , 17]);
                        console.info("[Nexus Settings] Removing " + info.moduleID);
                        return [4 /*yield*/, fs.promises.rm(info.path.replace('\\built\\', '\\external_modules\\') + '.zip')];
                    case 15:
                        _c.sent();
                        this.deletedModules.push(info.moduleID);
                        return [2 /*return*/, true];
                    case 16:
                        err_1 = _c.sent();
                        console.error("[Nexus Settings] An error occurred when deleting " + info.moduleID);
                        console.error(err_1);
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/, false];
                    case 18:
                        {
                            electron_1.app.relaunch();
                            electron_1.app.exit();
                            return [3 /*break*/, 27];
                        }
                        _c.label = 19;
                    case 19:
                        {
                            return [2 /*return*/, this.swapSettingsTab(data[0])];
                        }
                        _c.label = 20;
                    case 20:
                        {
                            elementId = data[0];
                            elementValue = data[1];
                            this.onSettingChange(elementId, elementValue);
                            return [3 /*break*/, 27];
                        }
                        _c.label = 21;
                    case 21:
                        {
                            settingId = data[0];
                            this.onSettingChange(settingId);
                            return [3 /*break*/, 27];
                        }
                        _c.label = 22;
                    case 22:
                        {
                            link = data[0];
                            electron_1.shell.openExternal(link);
                            return [3 /*break*/, 27];
                        }
                        _c.label = 23;
                    case 23:
                        moduleOrder = data[0];
                        return [4 /*yield*/, this.getSettings().findSetting('module_order').setValue(moduleOrder.join("|"))];
                    case 24:
                        _c.sent();
                        return [4 /*yield*/, this.fileManager.writeSettingsToStorage()];
                    case 25:
                        _c.sent();
                        return [3 /*break*/, 27];
                    case 26:
                        {
                            console.warn("[Nexus Setting] Unhandled event: " + eventType);
                        }
                        _c.label = 27;
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    SettingsProcess.prototype.addModuleSetting = function (module) {
        if (this.moduleSettingsList.get(module.getIPCSource()) !== undefined) {
            return;
        }
        this.moduleSettingsList.set(module.getIPCSource(), module.getSettings());
    };
    return SettingsProcess;
}(nexus_module_builder_1.Process));
exports.SettingsProcess = SettingsProcess;
//# sourceMappingURL=main.js.map