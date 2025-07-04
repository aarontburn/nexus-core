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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.MAIN_ID = void 0;
var electron_1 = require("electron");
var internal_args_1 = require("./init/internal-args");
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var init_directory_creator_1 = require("./init/init-directory-creator");
var window_creator_1 = require("./init/window-creator");
var module_loader_1 = require("./init/module-loader");
var global_event_handler_1 = require("./init/global-event-handler");
var main_1 = require("./internal-modules/settings/process/main");
var external_module_interfacer_1 = require("./init/external-module-interfacer");
var path_1 = __importDefault(require("path"));
var updater_process_1 = require("./internal-modules/auto-updater/updater-process");
var notification_process_1 = require("./internal-modules/notification/notification-process");
var PROTOCOL = "nexus-app";
electron_1.Menu.setApplicationMenu(null);
electron_1.app.whenReady().then(function () {
    nexusStart();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            nexusStart();
        }
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        electron_1.app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path_1["default"].resolve(process.argv[1])]);
    }
}
else {
    electron_1.app.setAsDefaultProtocolClient(PROTOCOL);
}
exports.MAIN_ID = 'nexus.Main';
function nexusStart() {
    return __awaiter(this, void 0, void 0, function () {
        var gotTheLock, processReady, rendererReady, context, internalArguments, _i, internalArguments_1, arg, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    gotTheLock = electron_1.app.requestSingleInstanceLock();
                    if (!gotTheLock) {
                        electron_1.app.exit();
                    }
                    processReady = false;
                    rendererReady = false;
                    context = {
                        moduleMap: undefined,
                        moduleViewMap: new Map(),
                        window: undefined,
                        settingModule: undefined,
                        ipcCallback: undefined,
                        displayedModule: undefined,
                        mainIPCSource: {
                            getIPCSource: function () {
                                return exports.MAIN_ID;
                            }
                        },
                        setProcessReady: function () {
                            processReady = true;
                            if (processReady && rendererReady) {
                                onProcessAndRendererReady(context);
                            }
                        },
                        setRendererReady: function () {
                            rendererReady = true;
                            if (processReady && rendererReady) {
                                onProcessAndRendererReady(context);
                            }
                        }
                    };
                    // Create all directories
                    return [4 /*yield*/, (0, init_directory_creator_1.createAllDirectories)()];
                case 1:
                    // Create all directories
                    _c.sent();
                    return [4 /*yield*/, (0, internal_args_1.getInternalArguments)()];
                case 2:
                    internalArguments = _c.sent();
                    for (_i = 0, internalArguments_1 = internalArguments; _i < internalArguments_1.length; _i++) {
                        arg = internalArguments_1[_i];
                        process.argv.push(arg);
                    }
                    return [4 /*yield*/, (0, internal_args_1.writeInternal)(internalArguments.filter(function (s) { return !s.startsWith("--force-reload-module") && !s.startsWith('--last_exported_id'); }))];
                case 3:
                    _c.sent();
                    // Load modules
                    _a = context;
                    return [4 /*yield*/, (0, module_loader_1.loadModules)(context)];
                case 4:
                    // Load modules
                    _a.moduleMap = _c.sent();
                    context.settingModule = context.moduleMap.get(main_1.MODULE_ID);
                    return [4 /*yield*/, (0, module_loader_1.verifyAllModuleSettings)(context)];
                case 5:
                    _c.sent();
                    context.setProcessReady();
                    // Run module preload
                    return [4 /*yield*/, Promise.allSettled(Array.from(context.moduleMap.values()).map(function (module) { module.beforeWindowCreated(); }))];
                case 6:
                    // Run module preload
                    _c.sent();
                    (0, global_event_handler_1.attachEventHandlerForMain)(context);
                    // Create window
                    _b = context;
                    return [4 /*yield*/, (0, window_creator_1.createBrowserWindow)(context)];
                case 7:
                    // Create window
                    _b.window = _c.sent();
                    return [4 /*yield*/, (0, window_creator_1.createWebViews)(context)];
                case 8:
                    _c.sent();
                    // Register IPC Callback
                    context.ipcCallback = (0, global_event_handler_1.getIPCCallback)(context);
                    attachSingleInstance(context);
                    (0, window_creator_1.showWindow)(context);
                    return [2 /*return*/];
            }
        });
    });
}
function attachSingleInstance(context) {
    var protocolWithExtension = PROTOCOL + "://";
    var onDeepLinkOrSecondInstance = function (path) {
        if (path.startsWith(protocolWithExtension)) {
            var data = path.slice(protocolWithExtension.length);
            var splitPath = data.split("_");
            switch (splitPath[0]) {
                case "install": {
                    console.log("Attempting to installing module from " + splitPath.slice(1).join('_'));
                    context.ipcCallback.requestExternalModule(context.mainIPCSource, updater_process_1.UPDATER_MODULE_ID, "install-module-from-git", splitPath.slice(1).join('_'))
                        .then(function (response) {
                        if (response.code === nexus_module_builder_1.HTTPStatusCodes.OK) {
                            context.ipcCallback.requestExternalModule(context.mainIPCSource, notification_process_1.NOTIFICATION_MANAGER_ID, "open-dialog", {
                                windowTitle: "Successfully Installed Module",
                                size: { width: 500, height: 300 },
                                markdownContentString: "\n                                        <h2 align=\"center\">\n                                            Successfully installed ".concat(response.body.moduleID, "\n                                        </h2>\n\n                                        <p align=\"center\">\n                                            You will need to restart Nexus.\n                                        </p>\n\n                                        <p align=\"center\">\n                                            Restart now?\n                                        </p>\n                                    "),
                                rejectAction: {
                                    text: "Later",
                                    action: function () {
                                        // do nothing?
                                    }
                                },
                                resolveAction: {
                                    text: "Restart",
                                    action: function () {
                                        electron_1.app.relaunch({
                                            args: process.argv.filter(function (arg) { return arg !== path; })
                                        });
                                        electron_1.app.quit();
                                    }
                                }
                            });
                        }
                    });
                    break;
                }
                default: {
                    console.error("No protocol handler found for URL: " + path);
                    break;
                }
            }
        }
    };
    electron_1.app.on('second-instance', function (_, commandLine, __) {
        // Someone tried to run a second instance, we should focus our window.
        if (context.window) {
            if (context.window.isMinimized()) {
                context.window.restore();
            }
            context.window.focus();
        }
        onDeepLinkOrSecondInstance(commandLine.pop());
    });
    // MacOS deep link compatibility i think
    electron_1.app.on('open-url', function (event, url) {
        event.preventDefault();
        onDeepLinkOrSecondInstance(url);
    });
    for (var _i = 0, _a = process.argv.filter(function (arg) { return arg.startsWith(PROTOCOL); }); _i < _a.length; _i++) {
        var arg = _a[_i];
        onDeepLinkOrSecondInstance(arg);
    }
}
function onProcessAndRendererReady(context) {
    if (process.argv.includes("--dev")) {
        electron_1.globalShortcut.register('Shift+CommandOrControl+I', function () {
            if (!context.window.isFocused()) {
                return;
            }
            var displayedModuleID = context.displayedModule.getID();
            context.moduleViewMap.get(displayedModuleID).webContents.openDevTools();
        });
        electron_1.globalShortcut.register('CommandOrControl+R', function () {
            if (!context.window.isFocused()) {
                return;
            }
            var displayedModuleID = context.displayedModule.getID();
            context.moduleViewMap.get(displayedModuleID).webContents.reloadIgnoringCache();
        });
    }
    context.moduleViewMap.forEach(function (moduleView) {
        moduleView.emit("bounds-changed");
    });
    context.displayedModule = undefined;
    var moduleOrder = context.settingModule.getSettings()
        .findSetting("module_order")
        .getValue();
    var data = [];
    context.moduleMap.forEach(function (module) {
        data.push({
            moduleName: module.getName(),
            moduleID: module.getIPCSource(),
            htmlPath: module.getHTMLPath(),
            iconPath: module.getIconPath(),
            url: module.getURL()
        });
    });
    context.ipcCallback.notifyRenderer(context.mainIPCSource, 'load-modules', { order: moduleOrder, modules: data });
    var startupModuleID = "nexus.Home";
    var openLastModule = context.settingModule
        .getSettings()
        .findSetting("startup_should_open_last_closed")
        .getValue();
    if (openLastModule) {
        startupModuleID = context.settingModule
            .getSettings()
            .findSetting("startup_last_open_id")
            .getValue();
    }
    else {
        startupModuleID = context.settingModule.getSettings().findSetting("startup_module_id").getValue();
    }
    if (!context.moduleMap.has(startupModuleID)) {
        startupModuleID = "nexus.Home";
    }
    (0, global_event_handler_1.swapVisibleModule)(context, startupModuleID);
    context.moduleMap.forEach(function (module) {
        if (module.getHTMLPath() === undefined) {
            module.initialize();
        }
    });
    (0, external_module_interfacer_1.interactWithExternalModules)(context);
}
//# sourceMappingURL=main.js.map