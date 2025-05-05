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
exports.__esModule = true;
exports.SettingsProcess = exports.MODULE_ID = void 0;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var electron_1 = require("electron");
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var ModuleImporter_1 = require("./ModuleImporter");
var settings_1 = require("./settings");
var internal_args_1 = require("../../../init/internal-args");
var module_loader_1 = require("../../../init/module-loader");
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
        _this.devModeSubscribers = [];
        _this.getSettings().setDisplayName("General");
        _this.setModuleInfo({
            name: "General",
            author: "aarontburn",
            description: "General settings."
        });
        return _this;
    }
    SettingsProcess.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings, _i, _a, moduleSettings, moduleName, list, temp;
            return __generator(this, function (_b) {
                _super.prototype.initialize.call(this);
                this.sendToRenderer("is-dev", this.getSettings().findSetting('dev_mode').getValue());
                settings = [];
                for (_i = 0, _a = Array.from(this.moduleSettingsList.values()); _i < _a.length; _i++) {
                    moduleSettings = _a[_i];
                    moduleName = moduleSettings.getDisplayName();
                    list = {
                        module: moduleName,
                        moduleInfo: moduleSettings.getProcess().getModuleInfo()
                    };
                    if (moduleSettings.allToArray().length !== 0) {
                        settings.push(list);
                    }
                    moduleSettings.getProcess().refreshAllSettings();
                }
                // Swap settings and home module so it appears at the top
                if (settings[0].module === "Home") {
                    temp = settings[0];
                    settings[0] = settings[1];
                    settings[1] = temp;
                }
                this.sendToRenderer("populate-settings-list", settings);
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
    SettingsProcess.prototype.onSettingModified = function (modifiedSetting) {
        return __awaiter(this, void 0, void 0, function () {
            var zoom_1, shouldForceReload_1, mode;
            return __generator(this, function (_a) {
                if (modifiedSetting === undefined) {
                    return [2 /*return*/];
                }
                switch (modifiedSetting.getAccessID()) {
                    case "zoom": {
                        zoom_1 = modifiedSetting.getValue();
                        electron_1.BaseWindow.getAllWindows()[0].contentView.children.forEach(function (view) {
                            view.webContents.setZoomFactor(zoom_1 / 100);
                            view.emit("bounds-changed");
                        });
                        break;
                    }
                    case "accent_color": {
                        electron_1.BaseWindow.getAllWindows()[0].contentView.children.forEach(function (view) {
                            // view.webContents.insertCSS(`:root { --accent-color: ${modifiedSetting.getValue()} !important;`, { cssOrigin: "user" })
                            view.webContents.executeJavaScript("document.documentElement.style.setProperty('--accent-color', '".concat(modifiedSetting.getValue(), "')"));
                        });
                        break;
                    }
                    case "dev_mode": {
                        this.sendToRenderer("is-dev", modifiedSetting.getValue());
                        this.devModeSubscribers.forEach(function (callback) {
                            callback(modifiedSetting.getValue());
                        });
                        break;
                    }
                    case "force_reload": {
                        shouldForceReload_1 = modifiedSetting.getValue();
                        (0, internal_args_1.readInternal)().then(internal_args_1.parseInternalArgs).then(function (args) {
                            if (shouldForceReload_1) {
                                if (!args.includes("--force-reload")) {
                                    args.push("--force-reload");
                                }
                            }
                            else {
                                args = args.filter(function (arg) { return arg !== "--force-reload"; });
                            }
                            return (0, internal_args_1.writeInternal)(args);
                        });
                        break;
                    }
                    case "dark_mode": {
                        mode = modifiedSetting.getValue();
                        electron_1.nativeTheme.themeSource = mode.toLowerCase();
                        break;
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    SettingsProcess.prototype.handleExternal = function (source, eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            var nameOrAccessID, setting, callback;
            return __generator(this, function (_a) {
                switch (eventType) {
                    case "get-setting": {
                        if (typeof data[0] !== 'string') {
                            return [2 /*return*/, { body: new Error("Parameter is not a string."), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                        }
                        nameOrAccessID = data[0];
                        setting = this.getSettings().findSetting(nameOrAccessID);
                        if (setting === undefined) {
                            return [2 /*return*/, { body: new Error("No setting found with the name or ID of ".concat(nameOrAccessID, ".")), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                        }
                        return [2 /*return*/, { body: setting.getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case 'is-developer-mode': {
                        return [2 /*return*/, { body: this.getSettings().findSetting('dev_mode').getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "get-accent-color": {
                        return [2 /*return*/, { body: this.getSettings().findSetting("accent_color").getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "get-module-order": {
                        return [2 /*return*/, { body: this.getSettings().findSetting("module_order").getValue(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case 'on-developer-mode-changed': {
                        callback = data[0];
                        if (typeof callback !== "function") {
                            return [2 /*return*/, { body: new Error("Callback is invalid."), code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST }];
                        }
                        this.devModeSubscribers.push(callback);
                        callback(this.getSettings().findSetting('dev_mode').getValue());
                        return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    default: {
                        return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.NOT_IMPLEMENTED }];
                    }
                }
                return [2 /*return*/];
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
    SettingsProcess.prototype.swapSettingsTab = function (moduleToSwapTo) {
        for (var _i = 0, _a = Array.from(this.moduleSettingsList.values()); _i < _a.length; _i++) {
            var moduleSettings = _a[_i];
            var name_1 = moduleSettings.getDisplayName();
            if (moduleToSwapTo !== name_1) {
                continue;
            }
            var settingsList = moduleSettings.getSettingsAndHeaders();
            var list = {
                module: name_1,
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
            var _a, moduleID_1, fileName, result, elementId, elementValue, settingId, link, moduleOrder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = eventType;
                        switch (_a) {
                            case "settings-init": return [3 /*break*/, 1];
                            case 'open-module-folder': return [3 /*break*/, 2];
                            case 'import-module': return [3 /*break*/, 3];
                            case 'manage-modules': return [3 /*break*/, 4];
                            case 'remove-module': return [3 /*break*/, 5];
                            case 'restart-now': return [3 /*break*/, 7];
                            case "swap-settings-tab": return [3 /*break*/, 8];
                            case "setting-modified": return [3 /*break*/, 9];
                            case 'setting-reset': return [3 /*break*/, 10];
                            case 'open-link': return [3 /*break*/, 11];
                            case "module-order": return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 15];
                    case 1:
                        {
                            this.initialize();
                            return [3 /*break*/, 15];
                        }
                        _b.label = 2;
                    case 2:
                        {
                            moduleID_1 = data[0];
                            electron_1.shell.openPath(path.normalize(nexus_module_builder_1.DIRECTORIES.MODULE_STORAGE_PATH + moduleID_1)).then(function (result) {
                                if (result !== '') {
                                    throw new Error('Could not find folder: ' + path.normalize(nexus_module_builder_1.DIRECTORIES.MODULE_STORAGE_PATH + moduleID_1));
                                }
                            });
                            return [3 /*break*/, 15];
                        }
                        _b.label = 3;
                    case 3:
                        {
                            return [2 /*return*/, (0, ModuleImporter_1.importModuleArchive)()];
                        }
                        _b.label = 4;
                    case 4:
                        {
                            return [2 /*return*/, (0, ModuleImporter_1.getImportedModules)(this.deletedModules)];
                        }
                        _b.label = 5;
                    case 5:
                        fileName = data[0];
                        return [4 /*yield*/, fs.promises.rm("".concat(nexus_module_builder_1.DIRECTORIES.EXTERNAL_MODULES_PATH, "/").concat(fileName))];
                    case 6:
                        result = _b.sent();
                        console.info("[Nexus Settings] Removing " + fileName);
                        if (result === undefined) {
                            this.deletedModules.push(fileName);
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                    case 7:
                        {
                            electron_1.app.relaunch();
                            electron_1.app.exit();
                            return [3 /*break*/, 15];
                        }
                        _b.label = 8;
                    case 8:
                        {
                            return [2 /*return*/, this.swapSettingsTab(data[0])];
                        }
                        _b.label = 9;
                    case 9:
                        {
                            elementId = data[0];
                            elementValue = data[1];
                            this.onSettingChange(elementId, elementValue);
                            return [3 /*break*/, 15];
                        }
                        _b.label = 10;
                    case 10:
                        {
                            settingId = data[0];
                            this.onSettingChange(settingId);
                            return [3 /*break*/, 15];
                        }
                        _b.label = 11;
                    case 11:
                        {
                            link = data[0];
                            electron_1.shell.openExternal(link);
                            return [3 /*break*/, 15];
                        }
                        _b.label = 12;
                    case 12:
                        moduleOrder = data[0];
                        return [4 /*yield*/, this.getSettings().findSetting('module_order').setValue(moduleOrder.join("|"))];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, this.fileManager.writeSettingsToStorage()];
                    case 14:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
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
//# sourceMappingURL=SettingsProcess.js.map