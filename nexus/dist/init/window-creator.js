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
exports.showWindow = exports.createWebViews = exports.createBrowserWindow = void 0;
var electron_1 = require("electron");
var path = __importStar(require("path"));
var constants_1 = require("../utils/constants");
function createBrowserWindow(context) {
    return __awaiter(this, void 0, void 0, function () {
        var window, view;
        var _this = this;
        return __generator(this, function (_a) {
            window = new electron_1.BaseWindow({
                show: false,
                height: constants_1.WINDOW_DIMENSION.height,
                width: constants_1.WINDOW_DIMENSION.width,
                autoHideMenuBar: true
            });
            window.on('close', function (event) { return __awaiter(_this, void 0, void 0, function () {
                var error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            event.preventDefault();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, Promise.allSettled(Array.from(context.moduleMap.values()).map(function (module) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, module.onExit()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); }))];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            console.error("Error during cleanup:", error_1);
                            return [3 /*break*/, 5];
                        case 4:
                            window.destroy();
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            view = new electron_1.WebContentsView({
                webPreferences: {
                    webviewTag: true,
                    additionalArguments: __spreadArray(__spreadArray([], process.argv, true), ["--module-ID:".concat(context.mainIPCSource.getIPCSource())], false),
                    backgroundThrottling: false,
                    preload: path.join(__dirname, "../preload.js"),
                    partition: context.mainIPCSource.getIPCSource()
                }
            });
            window.on('resize', function () {
                context.moduleViewMap.forEach(function (moduleView) {
                    moduleView.emit("bounds-changed");
                });
            });
            window.contentView.addChildView(view);
            view.webContents.loadURL("file://" + path.join(__dirname, "../view/index.html"));
            view.on('bounds-changed', function () {
                if (!window || !view) {
                    return;
                }
                var bounds = window.getContentBounds();
                view.setBounds({
                    x: 0,
                    y: 0,
                    width: 70 * view.webContents.zoomFactor,
                    height: bounds.height
                });
            });
            view.setBounds({ x: 0, y: 0, width: 1, height: 1 });
            view.webContents.openDevTools({ mode: 'detach' });
            context.moduleViewMap.set(context.mainIPCSource.getIPCSource(), view);
            return [2 /*return*/, window];
        });
    });
}
exports.createBrowserWindow = createBrowserWindow;
function createWebViews(context) {
    var _a;
    var viewMap = new Map();
    var _loop_1 = function (module_1) {
        var view = new electron_1.WebContentsView({
            webPreferences: {
                webviewTag: true,
                additionalArguments: __spreadArray(__spreadArray([], process.argv, true), ["--module-ID:".concat(module_1.getID())], false),
                backgroundThrottling: false,
                preload: path.join(__dirname, "../preload.js"),
                partition: module_1.getID()
            }
        });
        context.window.contentView.addChildView(view);
        if (module_1.getHTMLPath()) {
            view.webContents.loadURL("file://" + module_1.getHTMLPath());
            context.moduleViewMap.set(module_1.getIPCSource(), view);
        }
        else if (module_1.getURL()) {
            view.webContents.loadURL((_a = module_1.getURL) === null || _a === void 0 ? void 0 : _a.call(module_1).toString());
            context.moduleViewMap.set(module_1.getIPCSource(), view);
        }
        view.on('bounds-changed', function () {
            if (!context.window || !view) {
                return;
            }
            var bounds = context.window.getContentBounds();
            view.setBounds({
                x: 70 * context.moduleViewMap.get(context.mainIPCSource.getIPCSource()).webContents.zoomFactor,
                y: 0,
                width: bounds.width - (70 * context.moduleViewMap.get(context.mainIPCSource.getIPCSource()).webContents.zoomFactor),
                height: bounds.height
            });
        });
        view.setVisible(false);
        view.setBounds({ x: 0, y: 0, width: 1, height: 1 });
        viewMap.set(module_1.getIPCSource(), view);
    };
    for (var _i = 0, _b = Array.from(context.moduleMap.values()); _i < _b.length; _i++) {
        var module_1 = _b[_i];
        _loop_1(module_1);
    }
    return viewMap;
}
exports.createWebViews = createWebViews;
function showWindow(context) {
    var settings = context.settingModule.getSettings();
    context.window.setBounds({
        x: Number(settings.findSetting('window_x').getValue()),
        y: Number(settings.findSetting('window_y').getValue()),
        height: Number(settings.findSetting('window_height').getValue()),
        width: Number(settings.findSetting('window_width').getValue())
    });
    if (settings.findSetting('window_maximized').getValue() === true) {
        context.window.maximize();
    }
    context.window.show();
}
exports.showWindow = showWindow;
//# sourceMappingURL=window-creator.js.map