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
exports.getInternalSettings = exports.getSettings = exports.onSettingModified = exports.devModeSubscribers = void 0;
var types_1 = require("@nexus-app/nexus-module-builder/settings/types");
var electron_1 = require("electron");
var internal_args_1 = require("../../../init/internal-args");
var main_1 = require("../../../main");
exports.devModeSubscribers = [];
var onSettingModified = function (module, modifiedSetting) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, window_1, view, zoom_1, window_2, window_3, shouldForceReload_1, mode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (modifiedSetting === undefined) {
                    return [2 /*return*/];
                }
                _a = modifiedSetting.getAccessID();
                switch (_a) {
                    case 'collapse_sidebar': return [3 /*break*/, 1];
                    case "zoom": return [3 /*break*/, 3];
                    case "accent_color": return [3 /*break*/, 5];
                    case "dev_mode": return [3 /*break*/, 7];
                    case "force_reload": return [3 /*break*/, 8];
                    case "dark_mode": return [3 /*break*/, 9];
                }
                return [3 /*break*/, 10];
            case 1: return [4 /*yield*/, module.requestExternal(main_1.MAIN_ID, 'get-primary-window')];
            case 2:
                window_1 = (_b.sent()).body;
                view = window_1.contentView.children.at(-1);
                view.collapsed = modifiedSetting.getValue();
                window_1.contentView.children.forEach(function (view) { return view.emit("bounds-changed"); });
                return [3 /*break*/, 10];
            case 3:
                zoom_1 = modifiedSetting.getValue();
                return [4 /*yield*/, module.requestExternal(main_1.MAIN_ID, 'get-primary-window')];
            case 4:
                window_2 = (_b.sent()).body;
                window_2.contentView.children.forEach(function (view) {
                    view.webContents.setZoomFactor(zoom_1 / 100);
                    view.emit("bounds-changed");
                });
                return [3 /*break*/, 10];
            case 5: return [4 /*yield*/, module.requestExternal(main_1.MAIN_ID, 'get-primary-window')];
            case 6:
                window_3 = (_b.sent()).body;
                window_3.contentView.children.forEach(function (view) {
                    view.webContents.executeJavaScript("document.documentElement.style.setProperty('--accent-color', '".concat(modifiedSetting.getValue(), "')"));
                });
                return [3 /*break*/, 10];
            case 7:
                {
                    module.sendToRenderer("is-dev", modifiedSetting.getValue());
                    exports.devModeSubscribers.forEach(function (callback) {
                        callback(modifiedSetting.getValue());
                    });
                    return [3 /*break*/, 10];
                }
                _b.label = 8;
            case 8:
                {
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
                    return [3 /*break*/, 10];
                }
                _b.label = 9;
            case 9:
                {
                    mode = modifiedSetting.getValue();
                    electron_1.nativeTheme.themeSource = mode.toLowerCase();
                    return [3 /*break*/, 10];
                }
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.onSettingModified = onSettingModified;
var getSettings = function (module) {
    return [
        "test",
        new types_1.FileUploadSetting(module)
            .setName("Sample file upload")
            .setDescription("Sample description")
            .setDefault(''),
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
        new types_1.BooleanSetting(module)
            .setName('Collapse Sidebar')
            .setDefault(false)
            .setAccessID('collapse_sidebar'),
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
                    case 0: return [4 /*yield*/, module.requestExternal(main_1.MAIN_ID, "get-module-IDs")];
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
            .setName("Automatically Check for Nexus Updates")
            .setDescription("Check for updates automatically.")
            .setAccessID("always_update")
            .setDefault(true),
        new types_1.BooleanSetting(module)
            .setName("Automatically Check for Module Updates")
            .setDescription("Limited to 60 an hour.")
            .setAccessID("check_module_updates")
            .setDefault(false),
        new types_1.BooleanSetting(module)
            .setName("Force Reload Modules at Launch")
            .setDescription("Always recompile modules at launch. Will result in a slower boot.")
            .setAccessID("force_reload")
            .setDefault(false),
        new types_1.BooleanSetting(module)
            .setName('Developer Mode')
            .setAccessID('dev_mode')
            .setDefault(false),
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