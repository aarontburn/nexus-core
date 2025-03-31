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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ModuleCompiler = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var typescript_1 = __importDefault(require("typescript"));
var yauzl = __importStar(require("yauzl-promise"));
var promises_1 = require("stream/promises");
var nexus_module_builder_1 = require("@nexus/nexus-module-builder");
var ModuleCompiler = /** @class */ (function () {
    function ModuleCompiler() {
    }
    ModuleCompiler.importPluginArchive = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var folderName, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderName = filePath.split("\\").at(-1);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.promises.copyFile(filePath, "".concat(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH, "/").concat(folderName))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.loadPluginsFromStorage = function (ipcCallback, forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var externalModules, folders, _i, folders_1, folder, moduleFolderPath, subFiles, _a, subFiles_1, subFile, moduleInfo, module_1, m, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, nexus_module_builder_1.StorageHandler._createDirectories()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.compileAndCopy(forceReload)];
                    case 2:
                        _b.sent();
                        externalModules = [];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 12, , 13]);
                        return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH, this.IO_OPTIONS)];
                    case 4:
                        folders = _b.sent();
                        _i = 0, folders_1 = folders;
                        _b.label = 5;
                    case 5:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 11];
                        folder = folders_1[_i];
                        if (!folder.isDirectory()) {
                            return [3 /*break*/, 10];
                        }
                        moduleFolderPath = "".concat(folder.path, "/").concat(folder.name);
                        return [4 /*yield*/, fs.promises.readdir(moduleFolderPath, this.IO_OPTIONS)];
                    case 6:
                        subFiles = _b.sent();
                        _a = 0, subFiles_1 = subFiles;
                        _b.label = 7;
                    case 7:
                        if (!(_a < subFiles_1.length)) return [3 /*break*/, 10];
                        subFile = subFiles_1[_a];
                        if (!subFile.name.includes("Process")) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getModuleInfo(subFile.path + "/moduleinfo.json")];
                    case 8:
                        moduleInfo = _b.sent();
                        module_1 = require(subFile.path + "/" + subFile.name);
                        m = new module_1[Object.keys(module_1)[0]](ipcCallback);
                        m.setModuleInfo(moduleInfo);
                        externalModules.push(m);
                        _b.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10:
                        _i++;
                        return [3 /*break*/, 5];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_2 = _b.sent();
                        console.error(err_2);
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/, externalModules];
                }
            });
        });
    };
    ModuleCompiler.getModuleInfo = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fs.promises.readFile(path)];
                    case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])];
                    case 2:
                        err_3 = _c.sent();
                        if (err_3.code === 'ENOENT') { // File doesn't exist
                            return [2 /*return*/, undefined];
                        }
                        console.error(err_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     *  Checks if a module should be recompiled.
     *
     *  @param externalPath
     *  @param builtPath
     *  @returns true if the module should be recompiled.
     *  @returns false if the module should NOT be recompiled.
     */
    ModuleCompiler.checkModuleInfo = function (externalPath, builtPath) {
        return __awaiter(this, void 0, void 0, function () {
            var builtModuleInfo, moduleInfo, _i, _a, _b, key, value;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getModuleInfo(builtPath + "/moduleinfo.json")];
                    case 1:
                        builtModuleInfo = _c.sent();
                        if (!builtModuleInfo) {
                            if (builtModuleInfo === undefined) {
                                console.log("WARNING: ".concat(builtPath, " does not contain 'moduleinfo.json'."));
                            }
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this.getModuleInfo(externalPath + "/moduleinfo.json")];
                    case 2:
                        moduleInfo = _c.sent();
                        if (!moduleInfo) {
                            if (moduleInfo === undefined) {
                                console.log("WARNING: ".concat(externalPath, " does not contain 'moduleinfo.json'."));
                            }
                            return [2 /*return*/, true];
                        }
                        for (_i = 0, _a = Object.entries(moduleInfo); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            if (builtModuleInfo[key].toString() !== value.toString()) {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    ModuleCompiler.unarchive = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_1, folder, unarchiveDirectory, zip, _d, zip_1, zip_1_1, entry, readStream, writeStream, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH, this.IO_OPTIONS)];
                    case 1:
                        files = _e.sent();
                        fs.rmSync(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
                        return [4 /*yield*/, fs.promises.mkdir(this.TEMP_ARCHIVE_PATH, { recursive: true })];
                    case 2:
                        _e.sent();
                        _i = 0, files_1 = files;
                        _e.label = 3;
                    case 3:
                        if (!(_i < files_1.length)) return [3 /*break*/, 29];
                        folder = files_1[_i];
                        unarchiveDirectory = this.TEMP_ARCHIVE_PATH + folder.name.substring(0, folder.name.length - 4);
                        if (!(folder.name.split(".").at(-1) === 'zip')) return [3 /*break*/, 28];
                        return [4 /*yield*/, yauzl.open(folder.path + folder.name)];
                    case 4:
                        zip = _e.sent();
                        return [4 /*yield*/, fs.promises.mkdir(unarchiveDirectory, { recursive: true })];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, , 26, 28]);
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 19, 20, 25]);
                        _d = true, zip_1 = (e_1 = void 0, __asyncValues(zip));
                        _e.label = 8;
                    case 8: return [4 /*yield*/, zip_1.next()];
                    case 9:
                        if (!(zip_1_1 = _e.sent(), _a = zip_1_1.done, !_a)) return [3 /*break*/, 18];
                        _c = zip_1_1.value;
                        _d = false;
                        _e.label = 10;
                    case 10:
                        _e.trys.push([10, , 16, 17]);
                        entry = _c;
                        if (!entry.filename.endsWith('/')) return [3 /*break*/, 12];
                        return [4 /*yield*/, fs.promises.mkdir("".concat(unarchiveDirectory, "/").concat(entry.filename))];
                    case 11:
                        _e.sent();
                        return [3 /*break*/, 15];
                    case 12: return [4 /*yield*/, entry.openReadStream()];
                    case 13:
                        readStream = _e.sent();
                        writeStream = fs.createWriteStream("".concat(unarchiveDirectory, "/").concat(entry.filename));
                        return [4 /*yield*/, (0, promises_1.pipeline)(readStream, writeStream)];
                    case 14:
                        _e.sent();
                        _e.label = 15;
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        _d = true;
                        return [7 /*endfinally*/];
                    case 17: return [3 /*break*/, 8];
                    case 18: return [3 /*break*/, 25];
                    case 19:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 25];
                    case 20:
                        _e.trys.push([20, , 23, 24]);
                        if (!(!_d && !_a && (_b = zip_1["return"]))) return [3 /*break*/, 22];
                        return [4 /*yield*/, _b.call(zip_1)];
                    case 21:
                        _e.sent();
                        _e.label = 22;
                    case 22: return [3 /*break*/, 24];
                    case 23:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 24: return [7 /*endfinally*/];
                    case 25: return [3 /*break*/, 28];
                    case 26: return [4 /*yield*/, zip.close()];
                    case 27:
                        _e.sent();
                        return [7 /*endfinally*/];
                    case 28:
                        _i++;
                        return [3 /*break*/, 3];
                    case 29: return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.compileAndCopy = function (forceReload) {
        if (forceReload === void 0) { forceReload = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, compiledModules, moduleArchives, foldersToRemove, files, _i, files_2, folder, builtDirectory, moduleFolderPath, skipCompile, viewFolder, relativeCSSPath, relativeFontPath, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.unarchive()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, Promise.all([
                                fs.promises.readdir(nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH),
                                fs.promises.readdir(nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH)
                            ])];
                    case 2:
                        _a = _b.sent(), compiledModules = _a[0], moduleArchives = _a[1];
                        moduleArchives = moduleArchives.map(function (file) { return file.split('.').at(-2); }).filter(function (f) { return f && f !== 'temp'; });
                        foldersToRemove = moduleArchives.length === 0
                            ? compiledModules
                            : compiledModules.filter(function (value) { return !moduleArchives.includes(value); });
                        return [4 /*yield*/, Promise.all(foldersToRemove.map(function (folderName) {
                                var folderPath = nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH + "/" + folderName;
                                console.log("Removing '".concat(folderPath, "'"));
                                return fs.promises.rm(folderPath, { force: true, recursive: true });
                            }))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 18, , 19]);
                        return [4 /*yield*/, fs.promises.readdir(this.TEMP_ARCHIVE_PATH, this.IO_OPTIONS)];
                    case 5:
                        files = _b.sent();
                        _i = 0, files_2 = files;
                        _b.label = 6;
                    case 6:
                        if (!(_i < files_2.length)) return [3 /*break*/, 17];
                        folder = files_2[_i];
                        builtDirectory = nexus_module_builder_1.StorageHandler.COMPILED_MODULES_PATH + folder.name;
                        if (!folder.isDirectory()) {
                            return [3 /*break*/, 16];
                        }
                        moduleFolderPath = "".concat(folder.path).concat(folder.name);
                        return [4 /*yield*/, this.checkModuleInfo(moduleFolderPath, builtDirectory)];
                    case 7:
                        skipCompile = !(_b.sent());
                        if (!forceReload && skipCompile) {
                            console.log("Skipping compiling of " + folder.name + "; no changes detected.");
                            return [3 /*break*/, 16];
                        }
                        console.log("Removing " + builtDirectory);
                        return [4 /*yield*/, fs.promises.rm(builtDirectory, { force: true, recursive: true })];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, this.compileAndCopyDirectory(moduleFolderPath, builtDirectory)];
                    case 9:
                        _b.sent();
                        viewFolder = path.join(__dirname, "/view");
                        relativeCSSPath = path.join(viewFolder, "colors.css");
                        relativeFontPath = path.join(viewFolder, "Yu_Gothic_Light.ttf");
                        if (!process.argv.includes("--in-core")) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.copyFromProd(path.normalize(path.join(__dirname, "../node_modules/@nexus/nexus-module-builder/")), "".concat(builtDirectory, "/node_modules/@nexus/nexus-module-builder"))];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 11: return [4 /*yield*/, this.copyFromProd(path.normalize(path.join(__dirname, "../../nexus-module-builder/")), "".concat(builtDirectory, "/node_modules/@nexus/nexus-module-builder"))];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [4 /*yield*/, fs.promises.copyFile(relativeCSSPath, builtDirectory + "/node_modules/@nexus/nexus-module-builder/colors.css")];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, fs.promises.copyFile(relativeFontPath, builtDirectory + "/node_modules/@nexus/nexus-module-builder/Yu_Gothic_Light.ttf")];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16:
                        _i++;
                        return [3 /*break*/, 6];
                    case 17:
                        console.log("All files compiled and copied successfully.");
                        return [3 /*break*/, 19];
                    case 18:
                        error_1 = _b.sent();
                        console.error("Error:", error_1);
                        return [3 /*break*/, 19];
                    case 19:
                        fs.rmSync(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.compileAndCopyDirectory = function (readDirectory, outputDirectory) {
        return __awaiter(this, void 0, void 0, function () {
            var subFiles, _i, subFiles_2, subFile, fullSubFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.readdir(readDirectory, this.IO_OPTIONS)];
                    case 1:
                        subFiles = _a.sent();
                        return [4 /*yield*/, fs.promises.mkdir(outputDirectory, { recursive: true })];
                    case 2:
                        _a.sent();
                        _i = 0, subFiles_2 = subFiles;
                        _a.label = 3;
                    case 3:
                        if (!(_i < subFiles_2.length)) return [3 /*break*/, 12];
                        subFile = subFiles_2[_i];
                        fullSubFilePath = subFile.path + "/" + subFile.name;
                        if (!(path.extname(subFile.name) === ".ts" && !subFile.name.endsWith(".d.ts"))) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.compile(fullSubFilePath, outputDirectory)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 5:
                        if (!subFile.isDirectory()) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.compileAndCopyDirectory(readDirectory + "/" + subFile.name, outputDirectory + "/" + subFile.name)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        if (!(path.extname(subFile.name) === ".html")) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.formatHTML(fullSubFilePath, "".concat(outputDirectory, "/").concat(subFile.name))];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, fs.promises.copyFile(fullSubFilePath, "".concat(outputDirectory, "/").concat(subFile.name))];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.copyFromProd = function (sourcePath, destinationPath) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_3, file, fileContents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.mkdir(destinationPath, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.promises.readdir(sourcePath)];
                    case 2:
                        files = _a.sent();
                        _i = 0, files_3 = files;
                        _a.label = 3;
                    case 3:
                        if (!(_i < files_3.length)) return [3 /*break*/, 9];
                        file = files_3[_i];
                        if (!!file.includes(".")) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.copyFromProd(sourcePath + "/" + file, destinationPath + "/" + file)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, fs.promises.readFile(sourcePath + "/" + file)];
                    case 6:
                        fileContents = _a.sent();
                        return [4 /*yield*/, fs.promises.writeFile(destinationPath + "/" + file, fileContents)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.compile = function (inputFilePath, outputDir) {
        return __awaiter(this, void 0, void 0, function () {
            var inputFileContent, _a, outputText, diagnostics, outputFileName, outputFilePath, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!inputFilePath.endsWith(".ts")) {
                            console.log("Skipping " + inputFilePath + ". Not a compilable file (must be .ts)");
                            return [2 /*return*/];
                        }
                        inputFileContent = fs.readFileSync(inputFilePath, 'utf8');
                        _a = typescript_1["default"].transpileModule(inputFileContent, {
                            compilerOptions: {
                                esModuleInterop: true,
                                target: typescript_1["default"].ScriptTarget.ES5,
                                module: typescript_1["default"].ModuleKind.CommonJS,
                                noImplicitAny: true,
                                sourceMap: true,
                                baseUrl: ".",
                                paths: {
                                    "*": ["node_modules/*"]
                                }
                            }
                        }), outputText = _a.outputText, diagnostics = _a.diagnostics;
                        if (diagnostics && diagnostics.length > 0) {
                            console.error('Compilation errors:');
                            diagnostics.forEach(function (diagnostic) {
                                console.error(diagnostic.messageText);
                            });
                            return [2 /*return*/];
                        }
                        outputFileName = path.basename(inputFilePath).replace('.ts', '.js');
                        outputFilePath = path.join(outputDir, outputFileName);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fs.promises.mkdir(outputDir, { recursive: true })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, fs.promises.writeFile(outputFilePath, outputText)];
                    case 3:
                        _b.sent();
                        console.log("File compiled successfully: ".concat(outputFilePath));
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.error("Error compiling file: ".concat(error_2));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.formatHTML = function (htmlPath, outputPath) {
        return __awaiter(this, void 0, void 0, function () {
            var contents, lines, i, css, href, replacedCSS, finalCSS;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises.readFile(htmlPath)];
                    case 1:
                        contents = (_a.sent()).toString();
                        lines = contents.split("\n");
                        for (i = 0; i < lines.length; i++) {
                            switch (lines[i].trim()) {
                                case "<!-- @css -->": { // Modify colors.css path
                                    css = lines[i + 1].trim();
                                    href = css.replace("<", "").replace(">", "").split(" ")[2];
                                    if (href.substring(0, 4) !== "href") {
                                        throw new Error("Could not parse css line: " + css);
                                    }
                                    replacedCSS = href.replace("../../", "./node_modules/@nexus/nexus-module-builder/");
                                    finalCSS = "\t<link rel=\"stylesheet\" ".concat(replacedCSS, "\">");
                                    lines[i + 1] = finalCSS;
                                    break;
                                }
                            }
                        }
                        return [4 /*yield*/, fs.promises.writeFile(outputPath, lines.join("\n"))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ModuleCompiler.IO_OPTIONS = {
        encoding: "utf-8",
        withFileTypes: true
    };
    ModuleCompiler.TEMP_ARCHIVE_PATH = nexus_module_builder_1.StorageHandler.EXTERNAL_MODULES_PATH + '/temp/';
    return ModuleCompiler;
}());
exports.ModuleCompiler = ModuleCompiler;
//# sourceMappingURL=ModuleCompiler.js.map