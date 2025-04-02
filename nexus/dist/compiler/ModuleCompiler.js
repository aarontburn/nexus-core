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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.ModuleCompiler = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var yauzl = __importStar(require("yauzl-promise"));
var promises_1 = require("stream/promises");
var nexus_module_builder_1 = require("@nexus/nexus-module-builder");
var CompilerUtils_1 = require("./CompilerUtils");
var ModuleCompiler = /** @class */ (function () {
    function ModuleCompiler() {
    }
    ModuleCompiler.load = function (ipcCallback, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var err_1, err_2, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, nexus_module_builder_1.StorageHandler._createDirectories()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.unarchiveFromTemp()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.error("Error unarchiving files");
                        console.error(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.compileAndCopy(forceReload)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        err_2 = _a.sent();
                        console.error("Error compiling files");
                        console.error(err_2);
                        return [3 /*break*/, 8];
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.loadModulesFromBuiltStorage(ipcCallback)];
                    case 9: return [2 /*return*/, _a.sent()];
                    case 10:
                        err_3 = _a.sent();
                        console.error("Error loading modules files");
                        console.error(err_3);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/, []];
                }
            });
        });
    };
    ModuleCompiler.unarchiveFromTemp = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_1, folder, unarchiveDirectory, zip, _d, zip_1, zip_1_1, entry, readStream, writeStream, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH, CompilerUtils_1.IO_OPTIONS)];
                    case 1:
                        files = _e.sent();
                        return [4 /*yield*/, fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true })];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, fs.promises.mkdir(this.TEMP_ARCHIVE_PATH, { recursive: true })];
                    case 3:
                        _e.sent();
                        _i = 0, files_1 = files;
                        _e.label = 4;
                    case 4:
                        if (!(_i < files_1.length)) return [3 /*break*/, 30];
                        folder = files_1[_i];
                        unarchiveDirectory = this.TEMP_ARCHIVE_PATH + folder.name.substring(0, folder.name.length - 4);
                        if (!(folder.name.split(".").at(-1) === 'zip')) return [3 /*break*/, 29];
                        return [4 /*yield*/, yauzl.open(folder.path + folder.name)];
                    case 5:
                        zip = _e.sent();
                        return [4 /*yield*/, fs.promises.mkdir(unarchiveDirectory, { recursive: true })];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, , 27, 29]);
                        _e.label = 8;
                    case 8:
                        _e.trys.push([8, 20, 21, 26]);
                        _d = true, zip_1 = (e_1 = void 0, __asyncValues(zip));
                        _e.label = 9;
                    case 9: return [4 /*yield*/, zip_1.next()];
                    case 10:
                        if (!(zip_1_1 = _e.sent(), _a = zip_1_1.done, !_a)) return [3 /*break*/, 19];
                        _c = zip_1_1.value;
                        _d = false;
                        _e.label = 11;
                    case 11:
                        _e.trys.push([11, , 17, 18]);
                        entry = _c;
                        if (!entry.filename.endsWith('/')) return [3 /*break*/, 13];
                        return [4 /*yield*/, fs.promises.mkdir("".concat(unarchiveDirectory, "/").concat(entry.filename))];
                    case 12:
                        _e.sent();
                        return [3 /*break*/, 16];
                    case 13: return [4 /*yield*/, entry.openReadStream()];
                    case 14:
                        readStream = _e.sent();
                        writeStream = fs.createWriteStream("".concat(unarchiveDirectory, "/").concat(entry.filename));
                        return [4 /*yield*/, (0, promises_1.pipeline)(readStream, writeStream)];
                    case 15:
                        _e.sent();
                        _e.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        _d = true;
                        return [7 /*endfinally*/];
                    case 18: return [3 /*break*/, 9];
                    case 19: return [3 /*break*/, 26];
                    case 20:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 26];
                    case 21:
                        _e.trys.push([21, , 24, 25]);
                        if (!(!_d && !_a && (_b = zip_1["return"]))) return [3 /*break*/, 23];
                        return [4 /*yield*/, _b.call(zip_1)];
                    case 22:
                        _e.sent();
                        _e.label = 23;
                    case 23: return [3 /*break*/, 25];
                    case 24:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 25: return [7 /*endfinally*/];
                    case 26: return [3 /*break*/, 29];
                    case 27: return [4 /*yield*/, zip.close()];
                    case 28:
                        _e.sent();
                        return [7 /*endfinally*/];
                    case 29:
                        _i++;
                        return [3 /*break*/, 4];
                    case 30: return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.compileAndCopy = function (forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, builtModules, externalModules, foldersToRemove, files, _i, files_2, folder, builtDirectory, moduleFolderPath, skipCompile, err_4, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            fs.promises.readdir(nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH),
                            fs.promises.readdir(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH)
                        ])];
                    case 1:
                        _a = _b.sent(), builtModules = _a[0], externalModules = _a[1];
                        externalModules = externalModules.map(function (file) { return file.split('.').slice(0, -1).join('.'); }).filter(function (f) { return f && f !== 'temp'; });
                        foldersToRemove = externalModules.length === 0
                            ? builtModules
                            : builtModules.filter(function (value) { return !externalModules.includes(value); });
                        return [4 /*yield*/, Promise.all(foldersToRemove.map(function (folderName) {
                                var folderPath = nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH + "/" + folderName;
                                console.log("Removing '".concat(folderPath, "'"));
                                return fs.promises.rm(folderPath, { force: true, recursive: true });
                            }))];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 20, , 21]);
                        return [4 /*yield*/, fs.promises.readdir(this.TEMP_ARCHIVE_PATH, CompilerUtils_1.IO_OPTIONS)];
                    case 4:
                        files = _b.sent();
                        _i = 0, files_2 = files;
                        _b.label = 5;
                    case 5:
                        if (!(_i < files_2.length)) return [3 /*break*/, 19];
                        folder = files_2[_i];
                        builtDirectory = nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH + folder.name;
                        if (!folder.isDirectory()) {
                            return [3 /*break*/, 18];
                        }
                        moduleFolderPath = "".concat(folder.path).concat(folder.name);
                        return [4 /*yield*/, (0, CompilerUtils_1.shouldRecompileModule)(moduleFolderPath, builtDirectory)];
                    case 6:
                        skipCompile = !(_b.sent());
                        if (!forceReload && skipCompile) {
                            console.log("Skipping compiling of " + folder.name + "; no changes detected.");
                            return [3 /*break*/, 18];
                        }
                        console.log("Removing " + builtDirectory);
                        return [4 /*yield*/, fs.promises.rm(builtDirectory, { force: true, recursive: true })];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _b.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, (0, CompilerUtils_1.compileAndCopyDirectory)(moduleFolderPath, builtDirectory)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_4 = _b.sent();
                        console.error(err_4);
                        return [3 /*break*/, 11];
                    case 11:
                        if (!(process.argv.includes("--in-core") || !process.argv.includes("--dev"))) return [3 /*break*/, 13];
                        return [4 /*yield*/, (0, CompilerUtils_1.copyFromProd)(path.normalize(path.join(__dirname, "../node_modules/@nexus/nexus-module-builder/")), "".concat(builtDirectory, "/node_modules/@nexus/nexus-module-builder"))];
                    case 12:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, (0, CompilerUtils_1.copyFromProd)(path.normalize(path.join(__dirname, "../../@nexus/nexus-module-builder/")), "".concat(builtDirectory, "/node_modules/@nexus/nexus-module-builder"))];
                    case 14:
                        _b.sent();
                        _b.label = 15;
                    case 15: return [4 /*yield*/, fs.promises.copyFile(path.join(__dirname, "/view/colors.css"), builtDirectory + "/node_modules/@nexus/nexus-module-builder/colors.css")];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, fs.promises.copyFile(path.join(__dirname, "/view/font.ttf"), builtDirectory + "/node_modules/@nexus/nexus-module-builder/font.ttf")];
                    case 17:
                        _b.sent();
                        _b.label = 18;
                    case 18:
                        _i++;
                        return [3 /*break*/, 5];
                    case 19:
                        console.log("All files compiled and copied successfully.");
                        return [3 /*break*/, 21];
                    case 20:
                        error_1 = _b.sent();
                        console.error("Error:", error_1);
                        return [3 /*break*/, 21];
                    case 21: return [4 /*yield*/, fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true })];
                    case 22:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.loadModulesFromBuiltStorage = function (ipcCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var externalModules, folders, _loop_1, _i, folders_1, folder, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalModules = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH, CompilerUtils_1.IO_OPTIONS)];
                    case 2:
                        folders = _a.sent();
                        _loop_1 = function (folder) {
                            var moduleFolderPath, buildConfig, moduleInfo, module_1, m;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!folder.isDirectory()) { // only read folders
                                            return [2 /*return*/, "continue"];
                                        }
                                        moduleFolderPath = "".concat(folder.path, "/").concat(folder.name);
                                        buildConfig = (function () {
                                            try {
                                                var configPath = path.normalize(moduleFolderPath + "/export-config.js");
                                                var config = require(configPath);
                                                if (config["build"] === undefined) {
                                                    throw new Error("".concat(configPath, " missing 'build'"));
                                                }
                                                else if (config["build"]["id"] === undefined) {
                                                    throw new Error("".concat(configPath, ".build missing 'id'"));
                                                }
                                                else if (config["build"]["process"] === undefined) {
                                                    throw new Error("".concat(configPath, ".build missing 'process'"));
                                                }
                                                return config["build"];
                                            }
                                            catch (err) {
                                                return err;
                                            }
                                        })();
                                        if (buildConfig instanceof Error) {
                                            console.error(buildConfig);
                                            return [2 /*return*/, "continue"];
                                        }
                                        return [4 /*yield*/, (0, CompilerUtils_1.readModuleInfo)(moduleFolderPath + "/module-info.json")];
                                    case 1:
                                        moduleInfo = _b.sent();
                                        module_1 = require(moduleFolderPath + "/" + buildConfig["process"]);
                                        if (module_1["default"] === undefined) {
                                            console.error("LOAD ERROR: Process has no default export. Path: ".concat(moduleFolderPath + "/" + buildConfig["process"]));
                                            return [2 /*return*/, "continue"];
                                        }
                                        m = new module_1["default"]();
                                        m.setIPC(ipcCallback);
                                        m.setModuleInfo(moduleInfo);
                                        externalModules.push(m);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, folders_1 = folders;
                        _a.label = 3;
                    case 3:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 6];
                        folder = folders_1[_i];
                        return [5 /*yield**/, _loop_1(folder)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/, externalModules];
                }
            });
        });
    };
    ModuleCompiler.TEMP_ARCHIVE_PATH = nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH + '/temp/';
    return ModuleCompiler;
}());
exports.ModuleCompiler = ModuleCompiler;
//# sourceMappingURL=ModuleCompiler.js.map