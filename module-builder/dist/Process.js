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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
var HTTPStatusCodes_1 = require("./HTTPStatusCodes");
var ModuleSettings_1 = require("./ModuleSettings");
var FileManager_1 = require("./process-helpers/FileManager");
/**
 *  Class to encapsulate module behavior.
 *
 *  @interface
 *  @author aarontburn
 */
var Process = /** @class */ (function () {
    /**
     *  Entry point.
     *
     *  @param moduleName   The name of the module,
     *  @param htmlPath     The path to the HTML frontend.
     */
    function Process(args) {
        /**
         *  Boolean indicating if this module has been initialized.
         */
        this.hasBeenInit = false;
        this.moduleID = args.moduleID;
        this.moduleName = args.moduleName;
        if (args.paths) {
            this.htmlPath = args.paths.htmlPath;
            this.url = args.paths.urlPath;
            this.iconPath = args.paths.iconPath;
        }
        this.httpOptions = args.httpOptions;
        this.moduleSettings = new ModuleSettings_1.ModuleSettings(this);
        this.fileManager = new FileManager_1.default(this);
    }
    Process.prototype.getIconPath = function () {
        return this.iconPath;
    };
    Process.prototype.getURL = function () {
        return this.url;
    };
    Process.prototype.getHTTPOptions = function () {
        return this.httpOptions;
    };
    Process.prototype.setIPC = function (ipc) {
        if (this.ipcCallback !== undefined) {
            throw new Error("Cannot reassign IPC callback");
        }
        this.ipcCallback = ipc;
    };
    /**
     *  @returns the ID of the module.
     */
    Process.prototype.getID = function () {
        return this.moduleID;
    };
    /**
     *  @returns the name of the IPC source. By default,
     *      returns the module ID. This should not be modified.
     */
    Process.prototype.getIPCSource = function () {
        return this.moduleID;
    };
    /**
     *  @returns the name of the module.
     */
    Process.prototype.getName = function () {
        return this.moduleName;
    };
    /**
     *  @returns the settings associated with this module.
     */
    Process.prototype.getSettings = function () {
        return this.moduleSettings;
    };
    /**
     *  @returns true if @see initialize() has been called, false otherwise.
     */
    Process.prototype.isInitialized = function () {
        return this.hasBeenInit;
    };
    /**
     *  Lifecycle function that is (usually) called when the renderer is ready.
     *  Should be overridden and treated as the entry point to the module.
     *
     *  Child classes MUST do super.initialize() to properly
     *      set @see hasBeenInit, if the module depends on it.
     */
    Process.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.hasBeenInit = true;
                return [2 /*return*/];
            });
        });
    };
    /**
     *  @returns the info for this module.
     *  @see ModuleInfo
     */
    Process.prototype.getModuleInfo = function () {
        return this.moduleInfo;
    };
    /**
     *  Sets the info for this module.
     *  For external modules, this information is stored within 'module-info.json',
     *      and will automatically be set here.
     *
     *  @param moduleInfo The module info.
     */
    Process.prototype.setModuleInfo = function (moduleInfo) {
        if (this.moduleInfo !== undefined) {
            throw new Error("Attempted to reassign module info for " + this.moduleName);
        }
        this.moduleInfo = moduleInfo;
    };
    /**
     *  Function to register settings for this module.
     *
     *  This should not be called externally.
     *
     *  @returns An array of both Settings and strings (for section headers.)
     */
    Process.prototype.registerSettings = function () {
        return [];
    };
    /**
     *  Registers internal settings that will not appear under the settings window.
     *
     *  @returns An array of Settings.
     */
    Process.prototype.registerInternalSettings = function () {
        return [];
    };
    /**
     *  Function that is called whenever a setting that belongs to this
     *      module is modified.
     *
     *  For an example on how to use this, see {@link HomeProcess}
     */
    Process.prototype.onSettingModified = function (modifiedSetting) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.warn("Uncaught setting change: ".concat(this.getName(), " has no handler for setting modification."));
                return [2 /*return*/];
            });
        });
    };
    /**
     *  Refreshes all settings by passing them into {@link onSettingModified}
     *
     *  If the implementation of your {@link onSettingModified} refreshes ALL settings,
     *      this may result in many frontend updates. Use cautiously.
     */
    Process.prototype.refreshAllSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.allSettled(this.getSettings().allToArray().map(function (setting) { return _this.onSettingModified(setting); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  @private
     *
     *  Lifecycle function that is after ALL MODULES ARE LOADED, but before the window is shown.
     */
    Process.prototype.beforeWindowCreated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     *  @private
     *
     *  Lifecycle function that is called whenever the module is shown.
     */
    Process.prototype.onGUIShown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     *  @private
     *
     *  Lifecycle function that is called whenever the module is hidden.
     */
    Process.prototype.onGUIHidden = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     *  @private
     *
     *  Lifecycle function that is called before the application exits.
     */
    Process.prototype.onExit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     *  @returns the path to the HTML file associated with this module.
     */
    Process.prototype.getHTMLPath = function () {
        return this.htmlPath;
    };
    /**
     *  Entry point to receive events from the renderer.
     *
     *  @param eventType    The name of the event
     *  @param data         The data sent from the renderer.
     */
    Process.prototype.handleEvent = function (eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.warn("Uncaught message: ".concat(this.getName(), " has no renderer event handler."));
                return [2 /*return*/];
            });
        });
    };
    /**
     *  Send an event to the renderer.
     *
     *  @param eventType    The name of the event.
     *  @param data         The data to send.
     *  @see https://www.electronjs.org/docs/latest/tutorial/ipc#object-serialization
     */
    Process.prototype.sendToRenderer = function (eventType) {
        var _a;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        if (this.getHTMLPath() === undefined) {
            return;
        }
        (_a = this.ipcCallback).notifyRenderer.apply(_a, __spreadArray([this, eventType], data, false));
    };
    /**
     *  Exposes an API to external modules.
     *
     *  @param source       The module requesting data.
     *  @param eventType    The event type.
     *  @param data         Any additional data supplied;
     *  @returns            A Promise of the data to return.
     */
    Process.prototype.handleExternal = function (source, eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { code: HTTPStatusCodes_1.HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined }];
            });
        });
    };
    /**
     *  Requests information from another module.
     *
     *  @param target       The ID of the target module.
     *  @param eventType    The event type.
     *  @param data         Any additional data to be supplied
     *  @returns            The data returned from the request.
     */
    Process.prototype.requestExternal = function (target, eventType) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (_a = this.ipcCallback).requestExternalModule.apply(_a, __spreadArray([this, target, eventType], data, false))];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return Process;
}());
exports.Process = Process;
