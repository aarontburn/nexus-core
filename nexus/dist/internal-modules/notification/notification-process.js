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
exports.NotificationManagerProcess = exports.NOTIFICATION_MANAGER_ID = void 0;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var showdown_1 = __importDefault(require("showdown"));
var main_1 = require("../../main");
var NOTIFICATION_MANAGER_NAME = "Nexus Notification Manager";
exports.NOTIFICATION_MANAGER_ID = 'nexus.Notification_Manager';
var NotificationManagerProcess = /** @class */ (function (_super) {
    __extends(NotificationManagerProcess, _super);
    function NotificationManagerProcess() {
        var _this = _super.call(this, {
            moduleID: exports.NOTIFICATION_MANAGER_ID,
            moduleName: NOTIFICATION_MANAGER_NAME
        }) || this;
        _this.setModuleInfo({
            name: NOTIFICATION_MANAGER_NAME,
            id: exports.NOTIFICATION_MANAGER_ID,
            version: "1.0.0",
            author: "Nexus",
            description: "A popup notification manager for Nexus",
            link: 'https://github.com/aarontburn/nexus-core',
            build: {
                "build-version": 0,
                process: ''
            },
            platforms: ['win32', 'darwin', "linux"]
        });
        return _this;
    }
    NotificationManagerProcess.prototype.openDialog = function (props) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var window, modalWindow, _f, remotePort, localPort, mdConverter;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.requestExternal(main_1.MAIN_ID, 'get-primary-window')];
                    case 1:
                        window = (_g.sent()).body;
                        modalWindow = new electron_1.BrowserWindow({
                            parent: window,
                            modal: true,
                            width: (_b = (_a = props.size) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 800, height: (_d = (_c = props.size) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 500,
                            frame: false,
                            webPreferences: {
                                contextIsolation: true,
                                nodeIntegration: false,
                                preload: path_1["default"].join(__dirname, "./view/preload.js")
                            }
                        });
                        modalWindow.loadFile(path_1["default"].join(__dirname, './view/modal.html'));
                        _f = new electron_1.MessageChannelMain(), remotePort = _f.port1, localPort = _f.port2;
                        localPort.on('message', function (event) {
                            var _a = event.data, eventType = _a.eventType, data = _a.data;
                            switch (eventType) {
                                case "closed":
                                case "reject": {
                                    props.rejectAction.action();
                                    break;
                                }
                                case "resolve": {
                                    props.resolveAction.action();
                                    break;
                                }
                                default: {
                                    console.warn("[Nexus Notification Window] No modal handler found for event: " + eventType);
                                    break;
                                }
                            }
                        });
                        mdConverter = new showdown_1["default"].Converter();
                        localPort.postMessage({
                            initialData: {
                                windowTitle: props.windowTitle,
                                resolveText: props.resolveAction.text,
                                rejectText: (_e = props.rejectAction) === null || _e === void 0 ? void 0 : _e.text,
                                htmlContentString: mdConverter.makeHtml(props.markdownContentString.split("\n").map(function (line) { return line.trim(); }).join("\n")),
                                moduleID: props.sourceModule.getIPCSource()
                            }
                        });
                        localPort.start();
                        modalWindow.once('ready-to-show', function () {
                            modalWindow.webContents.postMessage('main-world-port', null, [remotePort]);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationManagerProcess.prototype.verifyNotificationProps = function (props) {
        if (typeof props !== 'object' || props === null)
            return false;
        var hasValidAction = function (action) {
            return action &&
                typeof action.text === 'string' &&
                typeof action.action === 'function';
        };
        var hasValidSize = function (size) {
            return size &&
                typeof size.width === 'number' &&
                typeof size.height === 'number';
        };
        return typeof props.windowTitle === 'string' &&
            typeof props.markdownContentString === 'string' &&
            hasValidAction(props.resolveAction) &&
            (props.rejectAction === undefined || hasValidAction(props.rejectAction)) &&
            (props.size === undefined || hasValidSize(props.size));
    };
    NotificationManagerProcess.prototype.handleExternal = function (source, eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            var props;
            return __generator(this, function (_a) {
                switch (eventType) {
                    case "open-dialog": {
                        props = data[0];
                        if (!this.verifyNotificationProps(props)) {
                            return [2 /*return*/, { code: nexus_module_builder_1.HTTPStatusCodes.BAD_REQUEST, body: new Error("Could not open dialog with parameters: " + JSON.stringify(data)) }];
                        }
                        props.sourceModule = source;
                        this.openDialog(props);
                        return [2 /*return*/, { code: nexus_module_builder_1.HTTPStatusCodes.OK, body: undefined }];
                        break;
                    }
                    default: {
                        return [2 /*return*/, { code: nexus_module_builder_1.HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined }];
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    return NotificationManagerProcess;
}(nexus_module_builder_1.Process));
exports.NotificationManagerProcess = NotificationManagerProcess;
//# sourceMappingURL=notification-process.js.map