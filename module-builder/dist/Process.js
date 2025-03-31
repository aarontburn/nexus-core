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
var ModuleSettings_1 = require("./ModuleSettings");
/**
 *  Class to encapsulate module behavior.
 *
 *  Many fields/methods are not intended to be public. However, the process
 *      of loading external modules forces everything to be public, for some reason.
 *      Fields/methods that have the @private annotations should be treated as if they were
 *      private and should NOT be accessed directly.
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
     *  @param ipcCallback  The IPC callback function.
     */
    function Process(moduleID, moduleName, htmlPath, ipcCallback) {
        /**
         *  @private
         *  @see getSetting
         *
         *  Object to store this module's settings.
         *  This should not be directly accessed.
         */
        this._moduleSettings = new ModuleSettings_1.ModuleSettings(this);
        /**
         *  @private
         *  @see isInitialized
         *
         *  Boolean indicating if this module has been initialized.
         */
        this._hasBeenInit = false;
        this._moduleID = moduleID;
        this._moduleName = moduleName;
        this._htmlPath = htmlPath;
        this._ipcCallback = ipcCallback;
        this._moduleSettings._addSettings(this.registerSettings());
        this._moduleSettings._addInternalSettings(this.registerInternalSettings());
    }
    /**
     *  @returns the name of the IPC source. By default,
     *      returns the module ID. This should not be modified.
     */
    Process.prototype.getIPCSource = function () {
        return this._moduleID;
    };
    /**
     *  @returns the name of the module.
     */
    Process.prototype.getName = function () {
        return this._moduleName;
    };
    /**
     *  @returns the settings associated with this module.
     */
    Process.prototype.getSettings = function () {
        return this._moduleSettings;
    };
    /**
     *  @returns the name of the settings file associated with this module.
     */
    Process.prototype.getSettingsFileName = function () {
        return this._moduleName.toLowerCase() + "_settings.json";
    };
    /**
     *  @returns true if @see initialize() has been called, false otherwise.
     */
    Process.prototype.isInitialized = function () {
        return this._hasBeenInit;
    };
    /**
     *  Lifecycle function that is (usually) called when the renderer is ready.
     *  Should be overridden and treated as the entry point to the module.
     *
     *  Child classes MUST do super.initialize() to properly
     *      set @see _hasBeenInit, if the module depends on it.
     */
    Process.prototype.initialize = function () {
        this._hasBeenInit = true;
        // Override this, and do a super.initialize() after initializing model.
    };
    /**
     *  @returns the info for this module.
     *  @see ModuleInfo
     */
    Process.prototype.getModuleInfo = function () {
        return this._moduleInfo;
    };
    /**
     *  Sets the info for this module.
     *  For external modules, this information is stored within 'moduleinfo.json',
     *      and will automatically be set here.
     *
     *  @param moduleInfo The module info.
     */
    Process.prototype.setModuleInfo = function (moduleInfo) {
        if (this._moduleInfo !== undefined) {
            throw new Error("Attempted to reassign module info for " + this._moduleName);
        }
        this._moduleInfo = moduleInfo;
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
     *  Refreshes all settings by passing them into {@link refreshSettings}
     *
     *  If the implementation of your {@link refreshSettings} refreshes ALL settings,
     *      this may result in many frontend updates. Use cautiously.
     */
    Process.prototype.refreshAllSettings = function () {
        for (var _i = 0, _a = this.getSettings().getSettings(); _i < _a.length; _i++) {
            var setting = _a[_i];
            this.refreshSettings(setting);
        }
    };
    /**
     *  @private
     *
     *  Lifecycle function that is called whenever the module is shown.
     */
    Process.prototype.onGUIShown = function () {
        // Do nothing by default.
    };
    /**
     *  @private
     *
     *  Lifecycle function that is called whenever the module is hidden.
     */
    Process.prototype.onGUIHidden = function () {
        // Do nothing by default. 
    };
    /**
     *  @private
     *
     *  Lifecycle function that is called before the application exits.
     */
    Process.prototype.onExit = function () {
        // Do nothing by default.
    };
    /**
     *  @returns the path to the HTML file associated with this module.
     */
    Process.prototype.getHTMLPath = function () {
        return this._htmlPath;
    };
    /**
     *  @returns a string representation of this module. Currently, just returns the name.
     */
    Process.prototype.toString = function () {
        return this._moduleName;
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
        (_a = this._ipcCallback).notifyRenderer.apply(_a, __spreadArray([this, eventType], data, false));
    };
    /**
     *  Exposes an API to external modules.
     *
     *  @param source       The module requesting data.
     *  @param eventType    The event type.
     *  @param data         Any additional data supplied;
     *  @returns            A Promise of the data to return.
     */
    Process.prototype.handleExternal = function (source, eventType) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            data[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.warn("[".concat(this._moduleName, "]: External module, '").concat(source.getIPCSource(), "' requested data.'"));
                console.warn("\tWith event type of: ".concat(eventType));
                console.warn("\tAnd data:");
                console.warn(data);
                return [2 /*return*/, null];
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
                return [2 /*return*/, (_a = this._ipcCallback).requestExternalModule.apply(_a, __spreadArray([this, target, eventType], data, false))];
            });
        });
    };
    return Process;
}());
exports.Process = Process;
