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
var compiler_utils_1 = require("./compiler-utils");
var ModuleCompiler = /** @class */ (function () {
    function ModuleCompiler() {
    }
    ModuleCompiler.load = function (forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var err_1, err_2, modules, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.time("Module Load Time");
                        return [4 /*yield*/, nexus_module_builder_1.StorageHandler._createDirectories()];
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
                        modules = [];
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.loadModulesFromBuiltStorage()];
                    case 10:
                        modules = _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        err_3 = _a.sent();
                        console.error("Error loading modules files");
                        console.error(err_3);
                        return [3 /*break*/, 12];
                    case 12:
                        console.timeEnd("Module Load Time");
                        return [2 /*return*/, modules];
                }
            });
        });
    };
    ModuleCompiler.unarchiveFromTemp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH, compiler_utils_1.IO_OPTIONS)];
                    case 1:
                        files = _a.sent();
                        return [4 /*yield*/, fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, fs.promises.mkdir(this.TEMP_ARCHIVE_PATH, { recursive: true })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, Promise.all(files.map(function (folder) { return __awaiter(_this, void 0, void 0, function () {
                                var unarchiveDirectory, zip, entryPromises, _loop_1, _a, zip_1, zip_1_1, e_1_1, error_1;
                                var _this = this;
                                var _b, e_1, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            unarchiveDirectory = this.TEMP_ARCHIVE_PATH + folder.name.substring(0, folder.name.length - 4);
                                            if (!(folder.name.split(".").at(-1) === 'zip')) return [3 /*break*/, 19];
                                            _e.label = 1;
                                        case 1:
                                            _e.trys.push([1, 18, , 19]);
                                            return [4 /*yield*/, yauzl.open(path.join(folder.path, folder.name))];
                                        case 2:
                                            zip = _e.sent();
                                            return [4 /*yield*/, fs.promises.mkdir(unarchiveDirectory, { recursive: true })];
                                        case 3:
                                            _e.sent();
                                            entryPromises = [];
                                            _e.label = 4;
                                        case 4:
                                            _e.trys.push([4, 9, 10, 15]);
                                            _loop_1 = function () {
                                                _d = zip_1_1.value;
                                                _a = false;
                                                try {
                                                    var entry = _d;
                                                    var entryPath = "".concat(unarchiveDirectory, "/").concat(entry.filename);
                                                    if (entry.filename.endsWith('/')) {
                                                        entryPromises.push(fs.promises.mkdir(entryPath, { recursive: true }));
                                                    }
                                                    else {
                                                        var dirPath = path.dirname(entryPath);
                                                        entryPromises.push(fs.promises.mkdir(dirPath, { recursive: true }).then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var readStream, writeStream;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, entry.openReadStream()];
                                                                    case 1:
                                                                        readStream = _a.sent();
                                                                        writeStream = fs.createWriteStream(entryPath);
                                                                        return [2 /*return*/, (0, promises_1.pipeline)(readStream, writeStream)];
                                                                }
                                                            });
                                                        }); }));
                                                    }
                                                }
                                                finally {
                                                    _a = true;
                                                }
                                            };
                                            _a = true, zip_1 = __asyncValues(zip);
                                            _e.label = 5;
                                        case 5: return [4 /*yield*/, zip_1.next()];
                                        case 6:
                                            if (!(zip_1_1 = _e.sent(), _b = zip_1_1.done, !_b)) return [3 /*break*/, 8];
                                            _loop_1();
                                            _e.label = 7;
                                        case 7: return [3 /*break*/, 5];
                                        case 8: return [3 /*break*/, 15];
                                        case 9:
                                            e_1_1 = _e.sent();
                                            e_1 = { error: e_1_1 };
                                            return [3 /*break*/, 15];
                                        case 10:
                                            _e.trys.push([10, , 13, 14]);
                                            if (!(!_a && !_b && (_c = zip_1["return"]))) return [3 /*break*/, 12];
                                            return [4 /*yield*/, _c.call(zip_1)];
                                        case 11:
                                            _e.sent();
                                            _e.label = 12;
                                        case 12: return [3 /*break*/, 14];
                                        case 13:
                                            if (e_1) throw e_1.error;
                                            return [7 /*endfinally*/];
                                        case 14: return [7 /*endfinally*/];
                                        case 15: return [4 /*yield*/, Promise.allSettled(entryPromises)];
                                        case 16:
                                            _e.sent();
                                            return [4 /*yield*/, zip.close()];
                                        case 17:
                                            _e.sent();
                                            return [3 /*break*/, 19];
                                        case 18:
                                            error_1 = _e.sent();
                                            console.error("Error processing ".concat(folder.name, ":"), error_1);
                                            return [3 /*break*/, 19];
                                        case 19: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.compileAndCopy = function (forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, builtModules, externalModules, foldersToRemove, files, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.time("compileAndCopy");
                        return [4 /*yield*/, Promise.all([
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
                        _b.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, fs.promises.readdir(this.TEMP_ARCHIVE_PATH, compiler_utils_1.IO_OPTIONS)];
                    case 4:
                        files = _b.sent();
                        return [4 /*yield*/, Promise.allSettled(files.map(function (tempFolders) { return __awaiter(_this, void 0, void 0, function () {
                                var builtDirectory, modulePathInTempDir, shouldRecompile, _a, err_4;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            builtDirectory = nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH + tempFolders.name;
                                            if (!tempFolders.isDirectory()) {
                                                return [2 /*return*/];
                                            }
                                            modulePathInTempDir = "".concat(tempFolders.path).concat(tempFolders.name);
                                            _a = process.argv.includes("--last_exported_id:".concat(tempFolders.name));
                                            if (_a) return [3 /*break*/, 2];
                                            return [4 /*yield*/, (0, compiler_utils_1.shouldRecompileModule)(modulePathInTempDir, builtDirectory)];
                                        case 1:
                                            _a = (_b.sent());
                                            _b.label = 2;
                                        case 2:
                                            shouldRecompile = _a;
                                            if (!forceReload && !shouldRecompile) {
                                                console.log("Skipping compiling of " + tempFolders.name + "; no changes detected.");
                                                return [2 /*return*/];
                                            }
                                            console.log("Removing " + builtDirectory);
                                            return [4 /*yield*/, fs.promises.rm(builtDirectory, { force: true, recursive: true })];
                                        case 3:
                                            _b.sent();
                                            _b.label = 4;
                                        case 4:
                                            _b.trys.push([4, 6, , 7]);
                                            return [4 /*yield*/, (0, compiler_utils_1.compileAndCopyDirectory)(modulePathInTempDir, builtDirectory)];
                                        case 5:
                                            _b.sent();
                                            return [3 /*break*/, 7];
                                        case 6:
                                            err_4 = _b.sent();
                                            console.error(err_4);
                                            return [3 /*break*/, 7];
                                        case 7:
                                            if (!(process.argv.includes("--in-core") || !process.argv.includes("--dev"))) return [3 /*break*/, 9];
                                            return [4 /*yield*/, (0, compiler_utils_1.copyFromProd)(path.normalize(path.join(__dirname, "../../node_modules/@nexus/nexus-module-builder/")), "".concat(builtDirectory, "/node_modules/@nexus/nexus-module-builder"))];
                                        case 8:
                                            _b.sent();
                                            return [3 /*break*/, 11];
                                        case 9: return [4 /*yield*/, (0, compiler_utils_1.copyFromProd)(path.normalize(path.join(__dirname, "../../../@nexus/nexus-module-builder/")), "".concat(builtDirectory, "/node_modules/@nexus/nexus-module-builder"))];
                                        case 10:
                                            _b.sent();
                                            _b.label = 11;
                                        case 11: return [4 /*yield*/, Promise.allSettled([
                                                fs.promises.copyFile(path.join(__dirname, "../view/colors.css"), builtDirectory + "/node_modules/@nexus/nexus-module-builder/colors.css"),
                                                fs.promises.copyFile(path.join(__dirname, "../view/font.ttf"), builtDirectory + "/node_modules/@nexus/nexus-module-builder/font.ttf")
                                            ])];
                                        case 12:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 5:
                        _b.sent();
                        console.log("All files compiled and copied successfully.");
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        console.error("Error:", error_2);
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true })];
                    case 8:
                        _b.sent();
                        console.timeEnd("compileAndCopy");
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.loadModulesFromBuiltStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var externalModules, folders, err_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.time("loadModulesFromBuiltStorage");
                        externalModules = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH, compiler_utils_1.IO_OPTIONS)];
                    case 2:
                        folders = _a.sent();
                        return [4 /*yield*/, Promise.allSettled(folders.map(function (folder) { return __awaiter(_this, void 0, void 0, function () {
                                var moduleFolderPath, buildConfig, moduleInfo, module, m;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!folder.isDirectory()) { // only read folders
                                                return [2 /*return*/];
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
                                                return [2 /*return*/];
                                            }
                                            return [4 /*yield*/, (0, compiler_utils_1.readModuleInfo)(moduleFolderPath + "/module-info.json")];
                                        case 1:
                                            moduleInfo = _a.sent();
                                            module = require(moduleFolderPath + "/" + buildConfig["process"]);
                                            if (module["default"] === undefined) {
                                                console.error("LOAD ERROR: Process has no default export. Path: ".concat(moduleFolderPath + "/" + buildConfig["process"]));
                                                return [2 /*return*/];
                                            }
                                            m = new module["default"]();
                                            m.setModuleInfo(moduleInfo);
                                            externalModules.push(m);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [3 /*break*/, 5];
                    case 5:
                        console.timeEnd("loadModulesFromBuiltStorage");
                        return [2 /*return*/, externalModules];
                }
            });
        });
    };
    ModuleCompiler.TEMP_ARCHIVE_PATH = nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH + '/temp/';
    return ModuleCompiler;
}());
exports.ModuleCompiler = ModuleCompiler;
//# sourceMappingURL=module-compiler.js.map