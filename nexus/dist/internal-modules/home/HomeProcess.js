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
exports.HomeProcess = exports.MODULE_ID = void 0;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var types_1 = require("@nexus-app/nexus-module-builder/settings/types");
var path = __importStar(require("path"));
var time_formats_1 = require("./utils/time-formats");
var updater_process_1 = require("../auto-updater/updater-process");
var electron_1 = require("electron");
var main_1 = require("../../main");
var MODULE_NAME = "Home";
exports.MODULE_ID = 'nexus.Home';
var HTML_PATH = path.join(__dirname, "./static/index.html");
var ICON_PATH = path.join(__dirname, "../../view/assets/logo-no-background.svg");
var HomeProcess = /** @class */ (function (_super) {
    __extends(HomeProcess, _super);
    function HomeProcess() {
        var _this = _super.call(this, {
            moduleID: exports.MODULE_ID,
            moduleName: MODULE_NAME,
            paths: {
                htmlPath: HTML_PATH,
                iconPath: ICON_PATH
            }
        }) || this;
        _this.setModuleInfo({
            name: MODULE_NAME,
            id: exports.MODULE_ID,
            author: "Nexus",
            version: "1.0.0",
            description: "A home screen that displays time and date.",
            build: {
                "build-version": 1,
                process: ''
            },
            link: 'https://github.com/aarontburn/nexus-core'
        });
        return _this;
    }
    HomeProcess.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var installedModules;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.getSettings().findSetting("is_first_launch").getValue()) return [3 /*break*/, 7];
                        this.sendToRenderer("is-first-launch");
                        return [4 /*yield*/, this.requestExternal(main_1.MAIN_ID, "get-module-IDs")];
                    case 1:
                        installedModules = (_a.sent()).body;
                        if (!(!process.argv.includes('--dev') && !installedModules.includes("aarontburn.Marketplace"))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.requestExternal(updater_process_1.UPDATER_MODULE_ID, "install-module-from-git", 'github.com/aarontburn/nexus-marketplace/releases/latest/download/aarontburn.Marketplace.zip')
                                .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(response.code === nexus_module_builder_1.HTTPStatusCodes.OK)) return [3 /*break*/, 1];
                                            electron_1.app.relaunch();
                                            electron_1.app.quit();
                                            return [3 /*break*/, 4];
                                        case 1: // error occurred when installed marketplace, ignore and move on
                                        return [4 /*yield*/, this.getSettings().findSetting("is_first_launch").setValue(false)];
                                        case 2:
                                            _a.sent();
                                            return [4 /*yield*/, this.fileManager.writeSettingsToStorage()];
                                        case 3:
                                            _a.sent();
                                            _a.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 3: // if it already is, proceed
                    return [4 /*yield*/, this.getSettings().findSetting("is_first_launch").setValue(false)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.fileManager.writeSettingsToStorage()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                    case 7: return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 8:
                        _a.sent();
                        // Start clock
                        this.updateDateAndTime(false);
                        this.clockTimeout = setTimeout(function () { return _this.updateDateAndTime(true); }, 1000 - new Date().getMilliseconds());
                        return [2 /*return*/];
                }
            });
        });
    };
    HomeProcess.prototype.onExit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _super.prototype.onExit.call(this);
                clearTimeout(this.clockTimeout);
                return [2 /*return*/];
            });
        });
    };
    HomeProcess.prototype.createSpan = function (text) {
        return "<span style='color: var(--accent-color)'>".concat(text, "</span>");
    };
    HomeProcess.prototype.updateDateAndTime = function (repeat) {
        var _this = this;
        var date = new Date();
        var standardTime = date.toLocaleString(time_formats_1.LOCALE, time_formats_1.STANDARD_TIME_FORMAT);
        var militaryTime = date.toLocaleString(time_formats_1.LOCALE, time_formats_1.MILITARY_TIME_FORMAT);
        var fullDate = date.toLocaleString(time_formats_1.LOCALE, time_formats_1.FULL_DATE_FORMAT);
        var abbreviatedDate = date.toLocaleString(time_formats_1.LOCALE, time_formats_1.ABBREVIATED_DATE_FORMAT);
        var formattedStandardTime = standardTime.replace(/:/g, this.createSpan(":"));
        var formattedAbbreviatedDate = abbreviatedDate.replace(/\//g, this.createSpan('.'));
        var formattedFullDate = fullDate.replace(/,/g, this.createSpan(','));
        var formattedMilitaryTime = militaryTime.replace(/:/g, this.createSpan(":"));
        this.sendToRenderer("update-clock", formattedFullDate, formattedAbbreviatedDate, formattedStandardTime, formattedMilitaryTime);
        if (repeat) {
            this.clockTimeout = setTimeout(function () { return _this.updateDateAndTime(true); }, 1000);
        }
    };
    HomeProcess.prototype.registerSettings = function () {
        return [
            'Date/Time',
            new types_1.NumberSetting(this)
                .setStep(5)
                .setMin(0)
                .setName("Full Date Font Size (1)")
                .setDescription("Adjusts the font size of the full date display (e.g. Sunday, January 1st, 2023).")
                .setAccessID("full_date_fs")
                .setDefault(40.0),
            new types_1.NumberSetting(this)
                .setStep(5)
                .setMin(0)
                .setName("Abbreviated Date Font Size (2)")
                .setDescription("Adjusts the font size of the abbreviated date display (e.g. 1/01/2023).")
                .setAccessID("abbr_date_fs")
                .setDefault(30.0),
            new types_1.NumberSetting(this)
                .setStep(5)
                .setMin(0)
                .setName("Standard Time Font Size (3)")
                .setDescription("Adjusts the font size of the standard time display (e.g. 11:59:59 PM).")
                .setAccessID('standard_time_fs')
                .setDefault(90.0),
            new types_1.NumberSetting(this)
                .setStep(5)
                .setMin(0)
                .setName("Military Time Font Size (4)")
                .setDescription("Adjusts the font size of the military time display (e.g. 23:59:49).")
                .setAccessID('military_time_fs')
                .setDefault(30.0),
            "Display",
            new types_1.StringSetting(this)
                .setName("Display Order")
                .setDescription("Adjusts the order of the time/date displays.")
                .setDefault("12 34")
                .setAccessID("display_order")
                .setValidator(function (o) {
                var s = o.toString();
                return s === "" || s.match("^(?!.*(\\d).*\\1)[1-4\\s]+$") ? s : null;
            }),
            new types_1.HexColorSetting(this)
                .setName("Text Color")
                .setDefault('#f5f5f5')
                .setAccessID('text_color'),
            new types_1.FileUploadSetting(this)
                .setName('Background Image Path')
                .setDefault('')
                .setAccessID('image_path'),
            new types_1.ChoiceSetting(this)
                .addOptions("Cover", "Contain")
                .useDropdown()
                .setName("Background Image Mode")
                .setDefault("Cover")
                .setAccessID("background_image_mode")
        ];
    };
    HomeProcess.prototype.registerInternalSettings = function () {
        return [
            new types_1.BooleanSetting(this)
                .setName("First Launch")
                .setAccessID("is_first_launch")
                .setDefault(true),
        ];
    };
    HomeProcess.prototype.onSettingModified = function (modifiedSetting) {
        return __awaiter(this, void 0, void 0, function () {
            var sizes;
            return __generator(this, function (_a) {
                if (HomeProcess.DATE_TIME_IDS.includes(modifiedSetting === null || modifiedSetting === void 0 ? void 0 : modifiedSetting.getAccessID())) {
                    sizes = {
                        fullDate: this.getSettings().findSetting('full_date_fs').getValue(),
                        abbrDate: this.getSettings().findSetting('abbr_date_fs').getValue(),
                        standardTime: this.getSettings().findSetting('standard_time_fs').getValue(),
                        militaryTime: this.getSettings().findSetting('military_time_fs').getValue()
                    };
                    this.sendToRenderer('font-sizes', sizes);
                }
                else if (modifiedSetting) {
                    switch (modifiedSetting.getAccessID()) {
                        case "background_image_mode":
                        case 'display_order':
                        case "text_color":
                        case "image_path": {
                            this.sendToRenderer(modifiedSetting.getAccessID(), modifiedSetting.getValue());
                            break;
                        }
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    HomeProcess.prototype.handleEvent = function (eventType, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (eventType) {
                    case "init": {
                        this.initialize();
                        break;
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    HomeProcess.DATE_TIME_IDS = ['full_date_fs', 'abbr_date_fs', 'standard_time_fs', 'military_time_fs'];
    return HomeProcess;
}(nexus_module_builder_1.Process));
exports.HomeProcess = HomeProcess;
//# sourceMappingURL=HomeProcess.js.map