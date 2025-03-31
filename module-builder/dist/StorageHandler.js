"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageHandler = void 0;
var fs = require("fs");
var os = require("os");
var StorageHandler = /** @class */ (function () {
    function StorageHandler() {
    }
    /**
     *  Creates necessary directories. Should not be called by any module.
     */
    StorageHandler._createDirectories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            fs.promises.mkdir(this.PATH, { recursive: true }),
                            fs.promises.mkdir(this.STORAGE_PATH, { recursive: true }),
                            fs.promises.mkdir(this.EXTERNAL_MODULES_PATH, { recursive: true }),
                            fs.promises.mkdir(this.COMPILED_MODULES_PATH, { recursive: true })
                        ])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  Write to a modules storage.
     *
     *  @param module   The source module.
     *  @param fileName The name of the file, including file extension.
     *  @param contents The contents to write in the file.
     */
    StorageHandler.writeToModuleStorage = function (module, fileName, contents) {
        return __awaiter(this, void 0, void 0, function () {
            var dirName, folderName, filePath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dirName = module.getIPCSource();
                        folderName = this.STORAGE_PATH + dirName + "/";
                        filePath = folderName + fileName;
                        return [4 /*yield*/, fs.promises.mkdir(folderName, { recursive: true })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, fs.promises.writeFile(filePath, contents)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  Writes the module settings to storage.
     *
     *  @param module The source module.
     */
    StorageHandler.writeModuleSettingsToStorage = function (module) {
        var settingMap = new Map();
        module.getSettings().getSettings().forEach(function (setting) {
            settingMap.set(setting.getName(), setting.getValue());
        });
        this.writeToModuleStorage(module, module.getSettingsFileName(), JSON.stringify(Object.fromEntries(settingMap), undefined, 4));
    };
    /**
     *  Reads a file from the modules storage.
     *
     *  @param module   The source module.
     *  @param fileName The name of the file to read.
     *  @param encoding The file encoding. Default is 'utf-8'
     *  @returns        The contents of the file, or null if there was an error reading it.
     */
    StorageHandler.readFromModuleStorage = function (module, fileName, encoding) {
        if (encoding === void 0) { encoding = 'utf-8'; }
        var dirName = module.getIPCSource();
        var folderName = this.STORAGE_PATH + dirName + "/";
        var filePath = folderName + fileName;
        try {
            var content = fs.readFileSync(filePath, { encoding: encoding });
            return content;
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
            console.log("File not found: " + filePath);
        }
        return null;
    };
    /**
     *  Read settings from module storage.
     *
     *  @param module The source module
     *  @returns A map of setting names to the setting.
     */
    StorageHandler.readSettingsFromModuleStorage = function (module) {
        var settingMap = new Map();
        var dirName = module.getIPCSource();
        var folderName = this.STORAGE_PATH + dirName + "/";
        var filePath = folderName + module.getSettingsFileName();
        var contents;
        try {
            contents = fs.readFileSync(filePath, 'utf-8');
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
            console.log("WARNING: directory not found.");
            return settingMap;
        }
        try {
            var json = JSON.parse(contents);
            for (var settingName in json) {
                settingMap.set(settingName, json[settingName]);
            }
        }
        catch (err) {
            console.error("Error parsing JSON for setting: " + module.getName());
        }
        return settingMap;
    };
    var _a;
    _a = StorageHandler;
    StorageHandler.PATH = os.homedir() + (!process.argv.includes('--dev') ? "/.modules/" : '/.modules_dev/');
    StorageHandler.STORAGE_PATH = _a.PATH + "/storage/";
    StorageHandler.EXTERNAL_MODULES_PATH = _a.PATH + "/external_modules/";
    StorageHandler.COMPILED_MODULES_PATH = _a.PATH + "/built/";
    return StorageHandler;
}());
exports.StorageHandler = StorageHandler;
