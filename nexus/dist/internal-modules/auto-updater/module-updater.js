"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var nexus_module_builder_1 = require("@nexus-app/nexus-module-builder");
var electron_1 = require("electron");
var fs = __importStar(require("fs"));
var path_1 = require("path");
var ModuleUpdater = /** @class */ (function () {
    function ModuleUpdater(context) {
        this.context = context;
    }
    ModuleUpdater.prototype.checkForAllUpdates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var releases;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info("[Nexus Auto Updater] Checking for module updates...");
                        releases = {};
                        return [4 /*yield*/, Promise.all(Array.from(this.context.moduleMap.values()).map(function (module) { return __awaiter(_this, void 0, void 0, function () {
                                var versionInfo, _a, code, message;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.getLatestRemoteVersion(module.getID())];
                                        case 1:
                                            versionInfo = _b.sent();
                                            if (versionInfo === undefined) {
                                                return [2 /*return*/];
                                            }
                                            // Decide if this should update for all different version or only ascending version
                                            if (this.compareSemanticVersion(versionInfo.latestVersion, versionInfo.currentVersion) === 1) {
                                                releases[module.getID()] = versionInfo;
                                            }
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = _b.sent();
                                            code = _a.code, message = _a.message;
                                            console.error("[Nexus Auto Updater] Error when checking for update: ".concat(code, " - ").concat(message));
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        this.updates = releases;
                        console.info("[Nexus Auto Updater] Module updates found:\n" +
                            Object.keys(releases)
                                .map(function (moduleID) { return "\t".concat(moduleID, " (").concat(releases[moduleID].currentVersion, " => ").concat(releases[moduleID].latestVersion, ")"); })
                                .join("\n"));
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleUpdater.prototype.getAvailableUpdates = function () {
        return __assign({}, this.updates);
    };
    ModuleUpdater.prototype.checkForUpdate = function (moduleID) {
        return __awaiter(this, void 0, void 0, function () {
            var versionInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLatestRemoteVersion(moduleID)];
                    case 1:
                        versionInfo = _a.sent();
                        if (versionInfo === undefined
                            || this.compareSemanticVersion(versionInfo.latestVersion, versionInfo.currentVersion) !== 1) {
                            console.info("[Nexus Auto Updater] No updates found for ".concat(moduleID, "."));
                            return [2 /*return*/, undefined];
                        }
                        else {
                            console.info("[Nexus Auto Updater] Update found for ".concat(moduleID, " (").concat(versionInfo.currentVersion, " => ").concat(versionInfo.latestVersion, ")."));
                            return [2 /*return*/, versionInfo];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleUpdater.prototype.downloadLatest = function (moduleID, url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, arrayBuffer, buffer, externalFolders, _i, externalFolders_1, folderName, pathToFolder, filePath, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        console.info("[Nexus Auto Updater] Downloading new version for ".concat(moduleID, " from ").concat(url));
                        return [4 /*yield*/, electron_1.net.fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        buffer = Buffer.from(arrayBuffer);
                        return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.DIRECTORIES.EXTERNAL_MODULES_PATH)];
                    case 3:
                        externalFolders = _a.sent();
                        _i = 0, externalFolders_1 = externalFolders;
                        _a.label = 4;
                    case 4:
                        if (!(_i < externalFolders_1.length)) return [3 /*break*/, 7];
                        folderName = externalFolders_1[_i];
                        if (!folderName.endsWith('.zip'))
                            return [3 /*break*/, 6];
                        if (!folderName.includes(moduleID)) return [3 /*break*/, 6];
                        pathToFolder = (0, path_1.join)(nexus_module_builder_1.DIRECTORIES.EXTERNAL_MODULES_PATH, folderName);
                        return [4 /*yield*/, fs.promises.rm(pathToFolder, { recursive: true, force: true })];
                    case 5:
                        _a.sent();
                        console.info("[Nexus Auto Updater] \tRemoved the old version of ".concat(moduleID));
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        filePath = "".concat(nexus_module_builder_1.DIRECTORIES.EXTERNAL_MODULES_PATH, "/").concat(moduleID, ".zip");
                        return [4 /*yield*/, fs.promises.writeFile(filePath, buffer)];
                    case 8:
                        _a.sent();
                        console.info("[Nexus Auto Updater] \tSuccessfully downloaded new version for ".concat(moduleID, "; will be applied next launch."));
                        return [2 /*return*/, true];
                    case 9:
                        err_1 = _a.sent();
                        console.error("[Nexus Auto Updater] An error occurred while updating ".concat(moduleID));
                        console.error(err_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, false];
                }
            });
        });
    };
    // Returns 1 if the version1 is higher, -1 if version2 is higher, 0 if equal
    ModuleUpdater.prototype.compareSemanticVersion = function (version1, version2) {
        var v1 = version1.split('.').map(function (part) { return parseInt(part, 10); });
        var v2 = version2.split('.').map(function (part) { return parseInt(part, 10); });
        for (var i = 0; i < 3; i++) {
            if (v1[i] !== v2[i]) {
                return v1[i] > v2[i] ? 1 : -1;
            }
        }
        return 0;
    };
    ModuleUpdater.prototype.getLatestRemoteVersion = function (moduleID) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var moduleInfo, response, releaseData, version, assets;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        moduleInfo = (_a = this.context.moduleMap.get(moduleID)) === null || _a === void 0 ? void 0 : _a.getModuleInfo();
                        if (moduleInfo === undefined) {
                            throw new Error("Attempted to access module info for a module that doesn't exist: " + moduleID);
                        }
                        if (!(moduleInfo["git-latest"] &&
                            moduleInfo["git-latest"]["git-repo-name"] &&
                            moduleInfo["git-latest"]['git-username'])) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch("https://api.github.com/repos/".concat(moduleInfo["git-latest"]['git-username'], "/").concat(moduleInfo["git-latest"]["git-repo-name"], "/releases/latest"))];
                    case 1:
                        response = _b.sent();
                        if (!response.ok) {
                            throw { code: response.status, message: response.statusText };
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        releaseData = _b.sent();
                        version = releaseData.tag_name;
                        assets = releaseData.assets;
                        if (!assets || assets.length === 0) {
                            console.warn("No assets found in the latest release.");
                        }
                        return [2 /*return*/, {
                                currentVersion: moduleInfo.version,
                                latestVersion: version,
                                url: assets[0].browser_download_url
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ModuleUpdater;
}());
exports["default"] = ModuleUpdater;
//# sourceMappingURL=module-updater.js.map