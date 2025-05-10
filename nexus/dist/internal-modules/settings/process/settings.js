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
exports.getInternalSettings = exports.getSettings = exports.onSettingModified = void 0;
var types_1 = require("@nexus-app/nexus-module-builder/settings/types");
var electron_1 = require("electron");
var internal_args_1 = require("../../../init/internal-args");
var devModeSubscribers = [];
var onSettingModified = function (module, modifiedSetting) { return __awaiter(void 0, void 0, void 0, function () {
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
                    view.webContents.executeJavaScript("document.documentElement.style.setProperty('--accent-color', '".concat(modifiedSetting.getValue(), "')"));
                });
                break;
            }
            case "dev_mode": {
                module.sendToRenderer("is-dev", modifiedSetting.getValue());
                devModeSubscribers.forEach(function (callback) {
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
}); };
exports.onSettingModified = onSettingModified;
var getSettings = function (module) {
    return [
        "Appearance",
        new types_1.ChoiceSetting(module)
            .addOptions("Dark", "Light", "System")
            .setName("Theme")
            .setDefault("Dark")
            .setAccessID('dark_mode'),
        new types_1.HexColorSetting(module)
            .setName("Accent Color")
            .setAccessID("accent_color")
            .setDescription("Changes the color of various elements.")
            .setDefault("#2290B5"),
        new types_1.NumberSetting(module)
            .setRange(25, 300)
            .setStep(10)
            .setName("Zoom Level (%)")
            .setDefault(100)
            .setAccessID('zoom'),
        "Startup",
        new types_1.BooleanSetting(module)
            .setName("Open Last Closed Module on Startup")
            .setDefault(false)
            .setAccessID('startup_should_open_last_closed'),
        new types_1.StringSetting(module)
            .setName("Startup Module ID")
            .setDefault('nexus.Home')
            .setAccessID('startup_module_id')
            .setValidator(function (input) { return __awaiter(void 0, void 0, void 0, function () {
            var installedModules;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, module.requestExternal("nexus.Main", "get-module-IDs")];
                    case 1:
                        installedModules = (_a.sent()).body;
                        if (installedModules.includes(input)) {
                            return [2 /*return*/, input];
                        }
                        return [2 /*return*/, null];
                }
            });
        }); }),
        "Developer",
        new types_1.BooleanSetting(module)
            .setName('Developer Mode')
            .setAccessID('dev_mode')
            .setDefault(false),
        new types_1.BooleanSetting(module)
            .setName("Force Reload Modules at Launch")
            .setDescription("Always recompile modules at launch. Will result in a slower boot.")
            .setAccessID("force_reload")
            .setDefault(false),
        new types_1.BooleanSetting(module)
            .setName("Automatically Install Updates")
            .setDescription("Always download Nexus updates and install before closing.")
            .setAccessID("always_update")
            .setDefault(true),
    ];
};
exports.getSettings = getSettings;
var getInternalSettings = function (module) {
    return [
        new types_1.BooleanSetting(module)
            .setName("Window Maximized")
            .setDefault(false)
            .setAccessID('window_maximized'),
        new types_1.NumberSetting(module)
            .setName('Window Width')
            .setDefault(1920)
            .setAccessID("window_width"),
        new types_1.NumberSetting(module)
            .setName('Window Height')
            .setDefault(1080)
            .setAccessID('window_height'),
        new types_1.NumberSetting(module)
            .setName('Window X')
            .setDefault(50)
            .setAccessID('window_x'),
        new types_1.NumberSetting(module)
            .setName('Window Y')
            .setDefault(50)
            .setAccessID('window_y'),
        new types_1.StringSetting(module)
            .setName('Module Order')
            .setDefault('')
            .setAccessID('module_order'),
        new types_1.StringSetting(module)
            .setName('Last Opened Module')
            .setDefault('nexus.Home')
            .setAccessID('startup_last_open_id'),
    ];
};
exports.getInternalSettings = getInternalSettings;
//# sourceMappingURL=settings.js.map