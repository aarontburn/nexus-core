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
exports.SettingsProcess = void 0;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var electron_1 = require("electron");
var nexus_module_builder_1 = require("@nexus/nexus-module-builder");
var types_1 = require("@nexus/nexus-module-builder/settings/types");
var ModuleImporter_1 = require("./ModuleImporter");
var SettingsProcess = /** @class */ (function (_super) {
    __extends(SettingsProcess, _super);
    function SettingsProcess(window) {
        var _this = _super.call(this, SettingsProcess.MODULE_ID, SettingsProcess.MODULE_NAME, SettingsProcess.HTML_PATH) || this;
        _this.moduleSettingsList = new Map();
        _this.deletedModules = [];
        _this.devModeSubscribers = [];
        _this.window = window;
        _this.getSettings().setName("General");
        _this.setModuleInfo({
            name: "General",
            author: "aarontburn",
            description: "General settings."
        });
        return _this;
    }
    SettingsProcess.prototype.registerSettings = function () {
        return [
            "Display",
            new types_1.HexColorSetting(this)
                .setName("Accent Color")
                .setAccessID("accent_color")
                .setDescription("Changes the color of various elements.")
                .setDefault("#2290B5"),
            new types_1.NumberSetting(this)
                .setRange(25, 300)
                .setStep(10)
                .setName("Zoom Level (%)")
                .setDefault(100)
                .setAccessID('zoom'),
            "Developer",
            new types_1.BooleanSetting(this)
                .setName('Developer Mode')
                .setAccessID('dev_mode')
                .setDefault(false),
            new types_1.BooleanSetting(this)
                .setName("Force Reload Modules at Launch")
                .setDescription("Always recompile modules at launch. Will result in a slower boot.")
                .setAccessID("force_reload")
                .setDefault(false),
        ];
    };
    SettingsProcess.prototype.registerInternalSettings = function () {
        return [
            new types_1.BooleanSetting(this)
                .setName("Window Maximized")
                .setDefault(false)
                .setAccessID('window_maximized'),
            new types_1.NumberSetting(this)
                .setName('Window Width')
                .setDefault(1920)
                .setAccessID("window_width"),
            new types_1.NumberSetting(this)
                .setName('Window Height')
                .setDefault(1080)
                .setAccessID('window_height'),
            new types_1.NumberSetting(this)
                .setName('Window X')
                .setDefault(50)
                .setAccessID('window_x'),
            new types_1.NumberSetting(this)
                .setName('Window Y')
                .setDefault(50)
                .setAccessID('window_y'),
        ];
    };
    SettingsProcess.prototype.onExit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isWindowMaximized, bounds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isWindowMaximized = this.window.isMaximized();
                        bounds = this.window.getBounds();
                        this.getSettings().getSetting('window_maximized').setValue(isWindowMaximized);
                        this.getSettings().getSetting('window_width').setValue(bounds.width);
                        this.getSettings().getSetting('window_height').setValue(bounds.height);
                        this.getSettings().getSetting('window_x').setValue(bounds.x);
                        this.getSettings().getSetting('window_y').setValue(bounds.y);
                        return [4 /*yield*/, nexus_module_builder_1.StorageHandler.writeModuleSettingsToStorage(this)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsProcess.prototype.refreshSettings = function (modifiedSetting) {
        if ((modifiedSetting === null || modifiedSetting === void 0 ? void 0 : modifiedSetting.getAccessID()) === 'zoom') {
            var zoom = modifiedSetting.getValue();
            this.window.webContents.setZoomFactor(zoom / 100);
        }
        else if ((modifiedSetting === null || modifiedSetting === void 0 ? void 0 : modifiedSetting.getAccessID()) === 'accent_color') {
            this.sendToRenderer("refresh-settings", modifiedSetting.getValue());
        }
        else if ((modifiedSetting === null || modifiedSetting === void 0 ? void 0 : modifiedSetting.getAccessID()) === 'dev_mode') {
            this.sendToRenderer("is-dev", modifiedSetting.getValue());
            this.devModeSubscribers.forEach(function (callback) {
                callback(modifiedSetting.getValue());
            });
        }
    };
    SettingsProcess.prototype.handleExternal = function (source, eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            var callback;
            return __generator(this, function (_a) {
                switch (eventType) {
                    case 'isDeveloperMode': {
                        return [2 /*return*/, this.getSettings().getSetting('dev_mode').getValue()];
                    }
                    case 'listenToDevMode': {
                        callback = data[0];
                        this.devModeSubscribers.push(callback);
                        callback(this.getSettings().getSetting('dev_mode').getValue());
                        break;
                    }
                    case "getAccentColor": {
                        return [2 /*return*/, this.getSettings().getSetting("accent_color").getValue()];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    SettingsProcess.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.sendToRenderer("is-dev", this.getSettings().getSetting('dev_mode').getValue());
        var settings = [];
        for (var _i = 0, _a = Array.from(this.moduleSettingsList.values()); _i < _a.length; _i++) {
            var moduleSettings = _a[_i];
            var moduleName = moduleSettings.getName();
            var list = {
                module: moduleName,
                moduleInfo: moduleSettings.getModule().getModuleInfo()
            };
            if (moduleSettings.getSettings().length !== 0) {
                settings.push(list);
            }
            moduleSettings.getModule().refreshAllSettings();
        }
        // Swap settings and home module so it appears at the top
        var temp = settings[0];
        settings[0] = settings[1];
        settings[1] = temp;
        this.sendToRenderer("populate-settings-list", settings);
    };
    // TODO: Restructure stuff 
    SettingsProcess.prototype.onSettingChange = function (settingID, newValue) {
        for (var _i = 0, _a = Array.from(this.moduleSettingsList.values()); _i < _a.length; _i++) {
            var moduleSettings = _a[_i];
            var settingsList = moduleSettings.getSettings();
            for (var _b = 0, settingsList_1 = settingsList; _b < settingsList_1.length; _b++) {
                var setting = settingsList_1[_b];
                var settingBox = setting.getUIComponent();
                for (var _c = 0, _d = settingBox.getInputIdAndType(); _c < _d.length; _c++) {
                    var group = _d[_c];
                    var id = group.id;
                    if (id === settingID) { // found the modified setting
                        var oldValue = setting.getValue();
                        if (newValue === undefined) {
                            setting.resetToDefault();
                        }
                        else {
                            setting.setValue(newValue);
                        }
                        setting.getParentModule().refreshSettings(setting);
                        console.info("SETTING CHANGED: '".concat(setting.getName(), "' | ").concat(oldValue, " => ").concat(setting.getValue(), " ").concat(newValue === undefined ? '[RESET TO DEFAULT]' : ''));
                        var update = settingBox.onChange(setting.getValue());
                        nexus_module_builder_1.StorageHandler.writeModuleSettingsToStorage(setting.getParentModule());
                        this.sendToRenderer("setting-modified", update);
                        return;
                    }
                }
            }
        }
    };
    SettingsProcess.prototype.handleEvent = function (eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, moduleID_1, fileName, result, moduleName, _loop_1, _i, _b, moduleSettings, state_1, elementId, elementValue, settingId, link;
            return __generator(this, function (_c) {
                switch (_c.label) {
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
                        }
                        return [3 /*break*/, 12];
                    case 1:
                        {
                            this.initialize();
                            return [3 /*break*/, 12];
                        }
                        _c.label = 2;
                    case 2:
                        {
                            moduleID_1 = data[0];
                            electron_1.shell.openPath(path.normalize(nexus_module_builder_1.StorageHandler.STORAGE_PATH + moduleID_1)).then(function (result) {
                                if (result !== '') {
                                    throw new Error('Could not find folder: ' + path.normalize(nexus_module_builder_1.StorageHandler.STORAGE_PATH + moduleID_1));
                                }
                            });
                            return [3 /*break*/, 12];
                        }
                        _c.label = 3;
                    case 3:
                        {
                            return [2 /*return*/, (0, ModuleImporter_1.importModuleArchive)()];
                        }
                        _c.label = 4;
                    case 4:
                        {
                            return [2 /*return*/, (0, ModuleImporter_1.getImportedModules)(this.deletedModules)];
                        }
                        _c.label = 5;
                    case 5:
                        fileName = data[0];
                        return [4 /*yield*/, fs.promises.rm("".concat(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH, "/").concat(fileName))];
                    case 6:
                        result = _c.sent();
                        console.log("Removing " + fileName);
                        if (result === undefined) {
                            this.deletedModules.push(fileName);
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        return [2 /*return*/, Promise.resolve(false)];
                    case 7:
                        {
                            electron_1.app.relaunch();
                            electron_1.app.exit();
                            return [3 /*break*/, 12];
                        }
                        _c.label = 8;
                    case 8:
                        {
                            moduleName = data[0];
                            _loop_1 = function (moduleSettings) {
                                var name_1 = moduleSettings.getName();
                                if (moduleName !== name_1) {
                                    return "continue";
                                }
                                var settingsList = moduleSettings.getSettingsAndHeaders();
                                var list = {
                                    module: name_1,
                                    moduleID: moduleSettings.getModule().getIPCSource(),
                                    moduleInfo: moduleSettings.getModule().getModuleInfo(),
                                    settings: []
                                };
                                settingsList.forEach(function (s) {
                                    if (typeof s === 'string') {
                                        list.settings.push(s);
                                        return;
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
                                });
                                return { value: list };
                            };
                            for (_i = 0, _b = Array.from(this.moduleSettingsList.values()); _i < _b.length; _i++) {
                                moduleSettings = _b[_i];
                                state_1 = _loop_1(moduleSettings);
                                if (typeof state_1 === "object")
                                    return [2 /*return*/, state_1.value];
                            }
                            return [3 /*break*/, 12];
                        }
                        _c.label = 9;
                    case 9:
                        {
                            elementId = data[0];
                            elementValue = data[1];
                            this.onSettingChange(elementId, elementValue);
                            return [3 /*break*/, 12];
                        }
                        _c.label = 10;
                    case 10:
                        {
                            settingId = data[0];
                            this.onSettingChange(settingId);
                            return [3 /*break*/, 12];
                        }
                        _c.label = 11;
                    case 11:
                        {
                            link = data[0];
                            electron_1.shell.openExternal(link);
                            return [3 /*break*/, 12];
                        }
                        _c.label = 12;
                    case 12: return [2 /*return*/];
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
    SettingsProcess.MODULE_NAME = "Settings";
    SettingsProcess.MODULE_ID = 'built_ins.Settings';
    SettingsProcess.HTML_PATH = path.join(__dirname, "./SettingsHTML.html");
    return SettingsProcess;
}(nexus_module_builder_1.Process));
exports.SettingsProcess = SettingsProcess;
//# sourceMappingURL=SettingsProcess.js.map