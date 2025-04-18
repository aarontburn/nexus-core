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
exports.__esModule = true;
exports.getImportedModules = exports.importModuleArchive = void 0;
var nexus_module_builder_1 = require("@nexus/nexus-module-builder");
var electron_1 = require("electron");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
function importModuleArchive() {
    return __awaiter(this, void 0, void 0, function () {
        var options, response, filePath, successful;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    options = {
                        properties: ['openFile'],
                        filters: [{ name: 'Nexus Archive File (.zip, .tar)', extensions: ['zip', 'tar'] }]
                    };
                    return [4 /*yield*/, electron_1.dialog.showOpenDialog(options)];
                case 1:
                    response = _a.sent();
                    if (response.canceled) {
                        return [2 /*return*/, undefined];
                    }
                    filePath = response.filePaths[0];
                    return [4 /*yield*/, importPluginArchive(filePath)];
                case 2:
                    successful = _a.sent();
                    if (successful) {
                        console.log("Successfully copied " + filePath + ". Restart required.");
                        return [2 /*return*/, true];
                    }
                    console.log("Error copying " + filePath + ".");
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.importModuleArchive = importModuleArchive;
function importPluginArchive(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var folderName, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    folderName = filePath.split("\\").at(-1);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fs.promises.copyFile(filePath, "".concat(nexus_module_builder_1.DIRECTORIES.EXTERNAL_MODULES_PATH, "/").concat(folderName))];
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
}
function getImportedModules(deletedModules) {
    return __awaiter(this, void 0, void 0, function () {
        var files, map, out;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readdir(nexus_module_builder_1.DIRECTORIES.EXTERNAL_MODULES_PATH, { withFileTypes: true })];
                case 1:
                    files = _a.sent();
                    map = new Map();
                    deletedModules.forEach(function (name) { return map.set(name, true); });
                    files.forEach(function (file) {
                        var extension = path.extname(file.name);
                        if (extension === '.zip') {
                            map.set(file.name, false);
                        }
                    });
                    out = [];
                    map.forEach(function (deleted, name) { return out.push({ name: name, deleted: deleted }); });
                    return [2 /*return*/, out];
            }
        });
    });
}
exports.getImportedModules = getImportedModules;
//# sourceMappingURL=ModuleImporter.js.map