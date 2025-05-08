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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.shouldRecompileModule = exports.readModuleInfo = exports.compileAndCopyDirectory = exports.compile = exports.isBuildConfigValid = exports.copyFromProd = exports.IO_OPTIONS = void 0;
var fs = __importStar(require("fs"));
var typescript_1 = __importDefault(require("typescript"));
var path = __importStar(require("path"));
exports.IO_OPTIONS = {
    encoding: "utf-8",
    withFileTypes: true
};
function copyFromProd(sourcePath, destinationPath) {
    return __awaiter(this, void 0, void 0, function () {
        var files, _i, files_1, file, fileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.mkdir(destinationPath, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readdir(sourcePath)];
                case 2:
                    files = _a.sent();
                    _i = 0, files_1 = files;
                    _a.label = 3;
                case 3:
                    if (!(_i < files_1.length)) return [3 /*break*/, 9];
                    file = files_1[_i];
                    if (!!file.includes(".")) return [3 /*break*/, 5];
                    return [4 /*yield*/, copyFromProd(sourcePath + "/" + file, destinationPath + "/" + file)];
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
}
exports.copyFromProd = copyFromProd;
function isBuildConfigValid(config) {
    if (config["build"] === undefined) {
        return [false, 'build'];
    }
    else if (config["build"]["id"] === undefined) {
        return [false, 'id'];
    }
    else if (config["build"]["process"] === undefined) {
        return [false, 'process'];
    }
    return [true, undefined];
}
exports.isBuildConfigValid = isBuildConfigValid;
function compile(inputFilePath, outputDir) {
    return __awaiter(this, void 0, void 0, function () {
        var inputFileContent, _a, outputText, diagnostics, outputFileName, outputFilePath, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!inputFilePath.endsWith(".ts")) {
                        console.log("Skipping " + inputFilePath + ". Not a compilable file (must be .ts)");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fs.promises.readFile(inputFilePath, 'utf8')];
                case 1:
                    inputFileContent = _b.sent();
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
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fs.promises.mkdir(outputDir, { recursive: true })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, fs.promises.writeFile(outputFilePath, outputText)];
                case 4:
                    _b.sent();
                    console.log("File compiled successfully: ".concat(outputFilePath));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.error("Error compiling file: ".concat(error_1));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.compile = compile;
function compileAndCopyDirectory(readDirectory, outputDirectory) {
    return __awaiter(this, void 0, void 0, function () {
        var subFiles, _i, subFiles_1, subFile, fullSubFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(readDirectory.split('/').at(-1) === "node_modules")) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs.promises.cp(readDirectory, outputDirectory, { force: true, recursive: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, fs.promises.readdir(readDirectory, exports.IO_OPTIONS)];
                case 3:
                    subFiles = _a.sent();
                    return [4 /*yield*/, fs.promises.mkdir(outputDirectory, { recursive: true })];
                case 4:
                    _a.sent();
                    _i = 0, subFiles_1 = subFiles;
                    _a.label = 5;
                case 5:
                    if (!(_i < subFiles_1.length)) return [3 /*break*/, 12];
                    subFile = subFiles_1[_i];
                    fullSubFilePath = subFile.path + "/" + subFile.name;
                    if (!(path.extname(subFile.name) === ".ts" && !subFile.name.endsWith(".d.ts"))) return [3 /*break*/, 7];
                    return [4 /*yield*/, compile(fullSubFilePath, outputDirectory)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    if (!subFile.isDirectory()) return [3 /*break*/, 9];
                    return [4 /*yield*/, compileAndCopyDirectory(readDirectory + "/" + subFile.name, outputDirectory + "/" + subFile.name)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, fs.promises.copyFile(fullSubFilePath, "".concat(outputDirectory, "/").concat(subFile.name))];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 5];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.compileAndCopyDirectory = compileAndCopyDirectory;
function readModuleInfo(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs.promises.readFile(path)];
                case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()).toString()])];
                case 2:
                    err_1 = _c.sent();
                    if (err_1.code !== 'ENOENT') { // File doesn't exist
                        console.error(err_1);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, undefined];
            }
        });
    });
}
exports.readModuleInfo = readModuleInfo;
/**
 *  Checks if a module should be recompiled.
 *
 *  @param externalPath
 *  @param builtPath
 *  @returns true if the module should be recompiled.
 *  @returns false if the module should NOT be recompiled.
 */
function shouldRecompileModule(externalPath, builtPath) {
    return __awaiter(this, void 0, void 0, function () {
        var builtModuleInfo, moduleInfo, _i, _a, _b, key, value;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, readModuleInfo(builtPath + "/module-info.json")];
                case 1:
                    builtModuleInfo = _c.sent();
                    if (!builtModuleInfo) {
                        console.log("WARNING: ".concat(builtPath, " does not contain 'module-info.json'."));
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, readModuleInfo(externalPath + "/module-info.json")];
                case 2:
                    moduleInfo = _c.sent();
                    if (!moduleInfo) {
                        console.log("WARNING: ".concat(externalPath, " does not contain 'module-info.json'."));
                        return [2 /*return*/, true];
                    }
                    for (_i = 0, _a = Object.entries(moduleInfo); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        if (builtModuleInfo[key] === undefined || builtModuleInfo[key].toString() !== value.toString()) {
                            return [2 /*return*/, true];
                        }
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.shouldRecompileModule = shouldRecompileModule;
//# sourceMappingURL=compiler-utils.js.map