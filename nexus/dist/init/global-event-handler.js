"use strict";
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
exports.handleExternalWrapper = exports.swapVisibleModule = exports.attachEventHandlerForMain = exports.getIPCCallback = void 0;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var electron_1 = require("electron");
var getIPCCallback = function (context) {
    return {
        notifyRenderer: notifyRendererWrapper(context),
        requestExternalModule: requestExternalModuleWrapper(context)
    };
};
exports.getIPCCallback = getIPCCallback;
function attachEventHandlerForMain(context) {
    electron_1.ipcMain.handle(context.mainIPCSource.getIPCSource().toLowerCase(), function (_, eventType, data) {
        switch (eventType) {
            case "renderer-init": {
                context.setRendererReady();
                break;
            }
            case "swap-modules": {
                swapVisibleModule(context, data[0]);
                break;
            }
            case "module-order": {
                context.settingModule.handleEvent("module-order", data);
                break;
            }
        }
    });
}
exports.attachEventHandlerForMain = attachEventHandlerForMain;
function swapVisibleModule(context, moduleID) {
    var _a;
    var module = context.moduleMap.get(moduleID);
    if (module === context.displayedModule) {
        return false; // If the module is the same, don't swap
    }
    for (var _i = 0, _b = Array.from(context.moduleViewMap.keys()); _i < _b.length; _i++) {
        var id = _b[_i];
        if (id === context.mainIPCSource.getIPCSource() || id === moduleID) {
            continue;
        }
        ;
        context.moduleViewMap.get(id).setVisible(false);
    }
    (_a = context.displayedModule) === null || _a === void 0 ? void 0 : _a.onGUIHidden();
    module.onGUIShown();
    context.moduleViewMap.get(moduleID).setVisible(true);
    context.displayedModule = module;
    context.ipcCallback.notifyRenderer(context.mainIPCSource, 'swapped-modules-to', moduleID);
    return true;
}
exports.swapVisibleModule = swapVisibleModule;
function handleExternalWrapper(context) {
    return function handleExternal(source, eventType, data) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var target, target, POSSIBLE_MODES, mode, view, target, view, target, didSwap, target;
            return __generator(this, function (_d) {
                switch (eventType) {
                    case "get-module-IDs": {
                        return [2 /*return*/, { body: Array.from(context.moduleMap.keys()), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "get-current-module-id": {
                        return [2 /*return*/, { body: context.displayedModule.getID(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "get-primary-window": {
                        return [2 /*return*/, { body: context.window, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "get-module-window": {
                        target = source.getIPCSource();
                        if (!context.moduleViewMap.has(target)) {
                            return [2 /*return*/, {
                                    body: new Error("Could not retrieve WebContentView for ".concat(target, "; either target doesn't exist or target is an internal module.")),
                                    code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND
                                }];
                        }
                        return [2 /*return*/, { body: context.moduleViewMap.get(target), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "open-dev-tools": {
                        target = source.getIPCSource() === "aarontburn.Debug_Console" ? data[1] : source.getIPCSource();
                        POSSIBLE_MODES = ['left', 'right', 'bottom', 'detach'];
                        mode = (_a = data[0]) !== null && _a !== void 0 ? _a : "right";
                        if (!POSSIBLE_MODES.includes(mode)) { // if the mode is invalid, set to default
                            mode = "right";
                        }
                        if (!context.moduleViewMap.has(target)) {
                            return [2 /*return*/, {
                                    body: new Error("Could not open devtools for ".concat(target, "; either module doesn't exist or module is an internal module.")),
                                    code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND
                                }];
                        }
                        view = context.moduleViewMap.get(target);
                        if (view.webContents.isDevToolsOpened()) {
                            view.webContents.closeDevTools();
                        }
                        view.webContents.openDevTools({ mode: mode });
                        return [2 /*return*/, { body: "Success: Opened devtools for " + target, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "reload": {
                        target = source.getIPCSource() === "aarontburn.Debug_Console" ? data[0] : source.getIPCSource();
                        if (!context.moduleViewMap.has(target)) {
                            return [2 /*return*/, {
                                    body: new Error("Could not refresh for ".concat(target, "; either module doesn't exist or module is an internal module.")),
                                    code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND
                                }];
                        }
                        view = context.moduleViewMap.get(target);
                        if (data.includes("--force")) {
                            view.webContents.reloadIgnoringCache();
                        }
                        else {
                            view.webContents.reload();
                        }
                        return [2 /*return*/, { body: "Success: Refreshed page for " + target, code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    case "swap-to-module": {
                        target = (_b = data[0]) !== null && _b !== void 0 ? _b : source.getIPCSource();
                        if (!context.moduleViewMap.has(target)) {
                            return [2 /*return*/, {
                                    body: new Error("Could not swap to ".concat(target, "; either module doesn't exist or module is an internal module.")),
                                    code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND
                                }];
                        }
                        didSwap = swapVisibleModule(context, target);
                        if (didSwap) {
                            return [2 /*return*/, { body: "Success: Swapped visible module to ".concat(target), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                        }
                        else {
                            return [2 /*return*/, { body: "Success: ".concat(target, " is already visible."), code: nexus_module_builder_1.HTTPStatusCodes.ALREADY_REPORTED }];
                        }
                    }
                    case "get-module-icon-path": {
                        target = (_c = data[0]) !== null && _c !== void 0 ? _c : source.getIPCSource();
                        if (!context.moduleMap.has(target)) {
                            return [2 /*return*/, {
                                    body: new Error("Couldn't get icon for ".concat(target, "; module doesn't exist.")),
                                    code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND
                                }];
                        }
                        return [2 /*return*/, { body: context.moduleMap.get(target).getIconPath(), code: nexus_module_builder_1.HTTPStatusCodes.OK }];
                    }
                    default: {
                        return [2 /*return*/, { body: undefined, code: nexus_module_builder_1.HTTPStatusCodes.NOT_IMPLEMENTED }];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
}
exports.handleExternalWrapper = handleExternalWrapper;
var notifyRendererWrapper = function (context) {
    return function (target, eventType) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        context.moduleViewMap.get(target.getIPCSource()).webContents.send(target.getIPCSource().toLowerCase(), eventType, data);
    };
};
var requestExternalModuleWrapper = function (context) {
    return function (source, targetModuleID, eventType) {
        var data = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            data[_i - 3] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var targetModule, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(targetModuleID === context.mainIPCSource.getIPCSource())) return [3 /*break*/, 2];
                        return [4 /*yield*/, handleExternalWrapper(context)(source, eventType, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        targetModule = context.moduleMap.get(targetModuleID);
                        if (targetModule === undefined) {
                            return [2 /*return*/, { body: "No module with ID of ".concat(targetModuleID, " found."), code: nexus_module_builder_1.HTTPStatusCodes.NOT_FOUND }];
                        }
                        return [4 /*yield*/, targetModule.handleExternal(source, eventType, data)];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
};
//# sourceMappingURL=global-event-handler.js.map