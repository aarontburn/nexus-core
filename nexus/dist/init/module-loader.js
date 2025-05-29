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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.writeModuleSettingsToStorage = exports.verifyAllModuleSettings = exports.loadModules = void 0;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var electron_1 = require("electron");
var module_compiler_1 = require("../compiler/module-compiler");
var global_event_handler_1 = require("./global-event-handler");
var HomeProcess_1 = require("../internal-modules/home/HomeProcess");
var main_1 = require("../internal-modules/settings/process/main");
var updater_process_1 = require("../internal-modules/auto-updater/updater-process");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var notification_process_1 = require("../internal-modules/notification/notification-process");
var INTERNAL_MODULE_IDS = [main_1.MODULE_ID, updater_process_1.MODULE_ID, HomeProcess_1.MODULE_ID, notification_process_1.NOTIFICATION_MANAGER_ID];
function loadModules(context) {
    return __awaiter(this, void 0, void 0, function () {
        var loadedModules, settingProcess, internalModules, moduleMap, _i, _a, module_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, module_compiler_1.ModuleCompiler.load(process.argv.includes("--force-reload"))];
                case 1:
                    loadedModules = _b.sent();
                    settingProcess = new main_1.SettingsProcess();
                    internalModules = [new HomeProcess_1.HomeProcess(), new updater_process_1.AutoUpdaterProcess(context), settingProcess, new notification_process_1.NotificationManagerProcess()];
                    moduleMap = new Map();
                    for (_i = 0, _a = __spreadArray(__spreadArray([], internalModules, true), loadedModules, true); _i < _a.length; _i++) {
                        module_1 = _a[_i];
                        module_1.setIPC((0, global_event_handler_1.getIPCCallback)(context));
                        registerModule(moduleMap, module_1);
                    }
                    return [2 /*return*/, moduleMap];
            }
        });
    });
}
exports.loadModules = loadModules;
function registerModule(map, module) {
    var moduleID = module.getIPCSource();
    var existingIPCProcess = map.get(moduleID);
    if (existingIPCProcess !== undefined) {
        console.error("WARNING: Modules with duplicate IDs have been found.");
        console.error("ID: ".concat(moduleID, " | Registered Module: ").concat(existingIPCProcess.getName(), " | New Module: ").concat(module.getName()));
        if (!INTERNAL_MODULE_IDS.includes(moduleID)) { // don't delete built-in modules, just skip it
            map["delete"](moduleID); // remove existing module
        }
        return;
    }
    map.set(moduleID, module);
    console.log("\tRegistering " + moduleID);
    electron_1.ipcMain.handle(moduleID.toLowerCase(), function (_, eventType, data) {
        if (data === void 0) { data = []; }
        return module.handleEvent(eventType, data);
    });
}
function verifyAllModuleSettings(context) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, module_2, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _i = 0, _a = Array.from(context.moduleMap.values());
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    module_2 = _a[_i];
                    _c = (_b = context.settingModule).addModuleSetting;
                    return [4 /*yield*/, verifyModuleSettings(module_2)];
                case 2:
                    _c.apply(_b, [_d.sent()]);
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.verifyAllModuleSettings = verifyAllModuleSettings;
function verifyModuleSettings(module) {
    return __awaiter(this, void 0, void 0, function () {
        var settingsMap, moduleSettings;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readSettingsFromModuleStorage(module)];
                case 1:
                    settingsMap = _a.sent();
                    moduleSettings = module.getSettings();
                    return [4 /*yield*/, Promise.allSettled(Array.from(settingsMap).map(function (_a) {
                            var settingName = _a[0], settingValue = _a[1];
                            return __awaiter(_this, void 0, void 0, function () {
                                var setting;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            setting = moduleSettings.findSetting(settingName);
                                            if (!(setting === undefined)) return [3 /*break*/, 1];
                                            console.log("WARNING: Invalid setting name: '" + settingName + "' found.");
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, setting.setValue(settingValue)];
                                        case 2:
                                            _b.sent();
                                            _b.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        }))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writeModuleSettingsToStorage(module)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, module];
            }
        });
    });
}
function writeModuleSettingsToStorage(module) {
    return __awaiter(this, void 0, void 0, function () {
        var settingMap, folderName, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settingMap = new Map();
                    module.getSettings().allToArray().forEach(function (setting) {
                        settingMap.set(setting.getName(), setting.getValue());
                    });
                    folderName = path.join(nexus_module_builder_1.DIRECTORIES.MODULE_STORAGE_PATH, module.getIPCSource(), "/");
                    filePath = folderName + getModuleSettingsName(module);
                    return [4 /*yield*/, fs.promises.mkdir(folderName, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(filePath, JSON.stringify(Object.fromEntries(settingMap), undefined, 4))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeModuleSettingsToStorage = writeModuleSettingsToStorage;
function readSettingsFromModuleStorage(module) {
    return __awaiter(this, void 0, void 0, function () {
        var settingMap, folderName, contents, err_1, json, settingName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settingMap = new Map();
                    folderName = path.join(nexus_module_builder_1.DIRECTORIES.MODULE_STORAGE_PATH, module.getIPCSource(), "/", getModuleSettingsName(module));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.promises.readFile(folderName, 'utf-8')];
                case 2:
                    contents = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (err_1.code !== 'ENOENT') {
                        throw err_1;
                    }
                    return [2 /*return*/, settingMap];
                case 4:
                    try {
                        json = JSON.parse(contents);
                        for (settingName in json) {
                            settingMap.set(settingName, json[settingName]);
                        }
                    }
                    catch (err) {
                        console.error("Error parsing JSON for setting: " + module.getName());
                    }
                    return [2 /*return*/, settingMap];
            }
        });
    });
}
function getModuleSettingsName(module) {
    return module.getName().toLowerCase() + "_settings.json";
}
//# sourceMappingURL=module-loader.js.map