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
exports.ModuleController = void 0;
var electron_1 = require("electron");
var path = __importStar(require("path"));
var SettingsProcess_1 = require("./built_ins/settings_module/SettingsProcess");
var HomeProcess_1 = require("./built_ins/home_module/HomeProcess");
var ModuleCompiler_1 = require("./compiler/ModuleCompiler");
var nexus_module_builder_1 = require("@nexus/nexus-module-builder");
var WINDOW_DIMENSION = { width: 1920, height: 1080 };
var ModuleController = /** @class */ (function () {
    function ModuleController() {
        this.ipc = electron_1.ipcMain;
        this.modulesByIPCSource = new Map();
        this.initReady = false;
        this.rendererReady = false;
    }
    ModuleController.prototype.getIPCSource = function () {
        return "built_ins.Main";
    };
    ModuleController.prototype.start = function () {
        var _this = this;
        this.createBrowserWindow();
        this.handleMainEvents();
        this.settingsModule = new SettingsProcess_1.SettingsProcess(this.window);
        this.settingsModule.setIPC(this.ipcCallback);
        this.registerModules().then(function () {
            if (_this.rendererReady) {
                _this.init();
            }
            else {
                _this.initReady = true;
            }
            var settings = _this.settingsModule.getSettings();
            _this.window.setBounds({
                x: Number(settings.findSetting('window_x').getValue()),
                y: Number(settings.findSetting('window_y').getValue()),
                height: Number(settings.findSetting('window_height').getValue()),
                width: Number(settings.findSetting('window_width').getValue())
            });
            if (settings.findSetting('window_maximized').getValue() === true) {
                _this.window.maximize();
            }
            _this.window.show();
        });
        // Refresh listener
        setTimeout(function () {
            _this.window.webContents.on("did-finish-load", function () {
                _this.init();
            });
        }, 500);
    };
    ModuleController.prototype.init = function () {
        var data = [];
        this.modulesByIPCSource.forEach(function (module) {
            data.push({
                moduleName: module.getName(),
                moduleID: module.getIPCSource(),
                htmlPath: module.getHTMLPath(),
                iconPath: module.getIconPath()
            });
        });
        this.ipcCallback.notifyRenderer(this, 'load-modules', data);
        this.swapVisibleModule("built_ins.Home");
        this.modulesByIPCSource.forEach(function (module) {
            if (module.getHTMLPath() === undefined) {
                module.initialize();
            }
        });
        this.addDebugConsoleCommands();
    };
    ModuleController.prototype.addDebugConsoleCommands = function () {
        var _this = this;
        this.ipcCallback.requestExternalModule(this, "aarontburn.Debug_Console", "addCommandPrefix", {
            prefix: "installed-modules",
            executeCommand: function (args) {
                console.info(Array.from(_this.modulesByIPCSource.keys()));
            },
            documentation: {
                shortDescription: "Lists IDs of all installed modules."
            }
        });
    };
    ModuleController.prototype.handleMainEvents = function () {
        var _this = this;
        this.ipc.handle(this.getIPCSource(), function (_, eventType, data) {
            switch (eventType) {
                case "renderer-init": {
                    if (_this.initReady) {
                        _this.init();
                    }
                    else {
                        _this.rendererReady = true;
                    }
                    break;
                }
                case "swap-modules": {
                    _this.swapVisibleModule(data[0]);
                    break;
                }
            }
        });
    };
    ModuleController.prototype.handleExternal = function (source, eventType) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (eventType) {
                    case "get-module-IDs": {
                        return [2 /*return*/, Array.from(this.modulesByIPCSource.keys())];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    ModuleController.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(Array.from(this.modulesByIPCSource.values()).map(function (module) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, module.onExit()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleController.prototype.swapVisibleModule = function (moduleID) {
        var _a;
        var module = this.modulesByIPCSource.get(moduleID);
        if (module === this.currentDisplayedModule) {
            return; // If the module is the same, don't swap
        }
        (_a = this.currentDisplayedModule) === null || _a === void 0 ? void 0 : _a.onGUIHidden();
        module.onGUIShown();
        this.currentDisplayedModule = module;
        this.ipcCallback.notifyRenderer(this, 'swap-modules', moduleID);
    };
    ModuleController.prototype.createBrowserWindow = function () {
        var _this = this;
        this.window = new electron_1.BrowserWindow({
            show: false,
            height: WINDOW_DIMENSION.height,
            width: WINDOW_DIMENSION.width,
            webPreferences: {
                additionalArguments: process.argv,
                backgroundThrottling: false,
                preload: path.join(__dirname, "preload.js")
            },
            autoHideMenuBar: true
        });
        this.window.on('close', function (event) { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.stop()];
                    case 2:
                        _a.sent();
                        this.window.destroy();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error during cleanup:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        this.window.loadFile(path.join(__dirname, "./view/index.html"));
        this.ipcCallback = {
            notifyRenderer: function (target, eventType) {
                var data = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    data[_i - 2] = arguments[_i];
                }
                _this.window.webContents.send(target.getIPCSource(), eventType, data);
            },
            requestExternalModule: this.handleInterModuleCommunication.bind(this) // Not sure if the binding is required
        };
    };
    ModuleController.prototype.handleInterModuleCommunication = function (source, targetModuleID, eventType) {
        var data = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            data[_i - 3] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var targetModule, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (targetModuleID === this.getIPCSource()) {
                            return [2 /*return*/, this.handleExternal(source, eventType, data)];
                        }
                        targetModule = this.modulesByIPCSource.get(targetModuleID);
                        if (targetModule === undefined) {
                            console.error("Module '".concat(source.getIPCSource(), "' attempted to access '").concat(targetModuleID, "', but no such module exists."));
                            return [2 /*return*/, new Error("No module with ID of ".concat(source.getIPCSource(), " found."))];
                        }
                        return [4 /*yield*/, targetModule.handleExternal(source, eventType, data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ModuleController.prototype.registerModules = function () {
        return __awaiter(this, void 0, void 0, function () {
            var home, _a, _b, forceReload;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("Registering modules...");
                        home = new HomeProcess_1.HomeProcess();
                        home.setIPC(this.ipcCallback);
                        this.addModule(home);
                        this.addModule(this.settingsModule);
                        _b = (_a = this.settingsModule).addModuleSetting;
                        return [4 /*yield*/, this.verifyModuleSettings(this.settingsModule)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        forceReload = this.settingsModule
                            .getSettings()
                            .findSetting("force_reload")
                            .getValue();
                        console.log("Force Reload: " + forceReload);
                        return [4 /*yield*/, ModuleCompiler_1.ModuleCompiler
                                .load(this.ipcCallback, forceReload)
                                .then(function (modules) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Promise.all(modules.map(function (m) { return _this.addModule(m); }))];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleController.prototype.addModule = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var moduleID, existingIPCProcess, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        moduleID = module.getIPCSource();
                        existingIPCProcess = this.modulesByIPCSource.get(moduleID);
                        if (existingIPCProcess !== undefined) {
                            console.error("WARNING: Modules with duplicate IDs have been found.");
                            console.error("ID: ".concat(moduleID, " | Registered Module: ").concat(existingIPCProcess.getName(), " | New Module: ").concat(module.getName()));
                            return [2 /*return*/];
                        }
                        console.log("\tRegistering " + moduleID);
                        this.modulesByIPCSource.set(moduleID, module);
                        this.ipc.handle(moduleID, function (_, eventType, data) {
                            if (data === void 0) { data = []; }
                            return module.handleEvent(eventType, data);
                        });
                        _b = (_a = this.settingsModule).addModuleSetting;
                        return [4 /*yield*/, this.verifyModuleSettings(module)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleController.prototype.verifyModuleSettings = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var settingsMap, moduleSettings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nexus_module_builder_1.StorageHandler.readSettingsFromModuleStorage(module)];
                    case 1:
                        settingsMap = _a.sent();
                        moduleSettings = module.getSettings();
                        settingsMap.forEach(function (settingValue, settingName) {
                            var setting = moduleSettings.findSetting(settingName);
                            if (setting === undefined) {
                                console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
                            }
                            else {
                                setting.setValue(settingValue);
                            }
                        });
                        nexus_module_builder_1.StorageHandler.writeModuleSettingsToStorage(module);
                        return [2 /*return*/, module];
                }
            });
        });
    };
    return ModuleController;
}());
exports.ModuleController = ModuleController;
//# sourceMappingURL=ModuleController.js.map