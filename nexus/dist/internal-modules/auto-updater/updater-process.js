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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.AutoUpdaterProcess = exports.MODULE_ID = void 0;
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var electron_1 = require("electron");
var electron_updater_1 = require("electron-updater");
var path = __importStar(require("path"));
var module_updater_1 = __importDefault(require("./module-updater"));
var MODULE_NAME = "Nexus Auto Updater";
exports.MODULE_ID = 'nexus.Auto_Updater';
var AutoUpdaterProcess = /** @class */ (function (_super) {
    __extends(AutoUpdaterProcess, _super);
    function AutoUpdaterProcess(context) {
        var _this = _super.call(this, {
            moduleID: exports.MODULE_ID,
            moduleName: MODULE_NAME
        }) || this;
        _this.autoUpdaterStarted = false;
        _this.version = process.argv.includes("--dev") ? process.env.npm_package_version : electron_1.app.getVersion();
        _this.moduleUpdater = new module_updater_1["default"](context);
        _this.setModuleInfo({
            name: MODULE_NAME,
            id: exports.MODULE_ID,
            version: "1.0.0",
            author: "Nexus",
            description: "The Nexus auto-updater.",
            build: {
                "build-version": 0,
                process: ''
            },
            platforms: ['win32', 'darwin']
        });
        return _this;
    }
    AutoUpdaterProcess.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.info("[Nexus Auto Updater] Checking for module updates...");
                this.moduleUpdater.initialize();
                return [2 /*return*/];
            });
        });
    };
    AutoUpdaterProcess.prototype.startAutoUpdater = function () {
        var _this = this;
        if (this.autoUpdaterStarted) {
            return;
        }
        this.autoUpdaterStarted = true;
        console.info("[Nexus Auto Updater] Current Nexus Version: " + this.version);
        console.info("[Nexus Auto Updater] Starting auto updater.");
        var TEN_MIN = 10 * 60 * 1000;
        if (process.argv.includes("--dev")) {
            electron_updater_1.autoUpdater.autoDownload = false;
            electron_updater_1.autoUpdater.autoInstallOnAppQuit = false;
            electron_updater_1.autoUpdater.updateConfigPath = path.join(__dirname, '../../view/dev-app-update.yml');
            electron_updater_1.autoUpdater.forceDevUpdateConfig = true;
        }
        electron_updater_1.autoUpdater.logger = null;
        electron_updater_1.autoUpdater.disableWebInstaller = true;
        var interval = undefined;
        electron_updater_1.autoUpdater.on('checking-for-update', function () {
            console.info("[Nexus Auto Updater] Checking for update...");
        });
        electron_updater_1.autoUpdater.on('update-available', function (info) {
            var out = [];
            out.push("[Nexus Auto Updater] Update Found:");
            if (info.releaseName) {
                out.push("\tRelease Name: ".concat(info.releaseName));
            }
            out.push("\tRelease Date: ".concat(info.releaseDate.split("T")[0]));
            out.push("\tVersion: ".concat(electron_1.app.getVersion(), " => ").concat(info.version));
            if (info.releaseNotes) {
                out.push("\tRelease Notes: ".concat(info.releaseNotes));
            }
            console.info("\n" + out.join("\n") + "\n");
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('update-downloaded', function (event) {
            console.info("[Nexus Auto Updater] Release ".concat(event.version, " downloaded. This will be installed on next launch."));
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('update-cancelled', function (event) {
            console.info("[Nexus Auto Updater] Update cancelled.");
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('update-not-available', function (info) {
            console.info("[Nexus Auto Updater] No updates found. Current Version: ".concat(_this.version, " | Remote Version: ").concat(info.version));
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.on('error', function (err) {
            console.error("[Nexus Auto Updater] An error occurred while checking for updates: " + err.message);
            clearInterval(interval);
        });
        electron_updater_1.autoUpdater.checkForUpdates()["catch"](function () { }); // Ignore errors since this will be handled by the code above, i think?
        interval = setInterval(function () {
            electron_updater_1.autoUpdater.checkForUpdates()["catch"](function () { });
        }, TEN_MIN);
    };
    return AutoUpdaterProcess;
}(nexus_module_builder_1.Process));
exports.AutoUpdaterProcess = AutoUpdaterProcess;
//# sourceMappingURL=updater-process.js.map