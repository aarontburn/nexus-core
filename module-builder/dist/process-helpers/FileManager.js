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
var fs = require("fs");
var os = require("os");
var path = require("path");
var FileManger = /** @class */ (function () {
    function FileManger(module) {
        this.module = module;
        this.settingsFileName = module.getName().toLowerCase() + "_settings.json";
        this.storagePath = path.join(os.homedir(), process.argv.includes('--dev') ? '/.nexus_dev/' : "/.nexus/", "/storage/", module.getIPCSource(), "/");
    }
    FileManger.prototype.readFromStorage = function (fileName_1) {
        return __awaiter(this, arguments, void 0, function (fileName, encoding) {
            var filePath, content, error_1;
            if (encoding === void 0) { encoding = 'utf-8'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path.join(this.storagePath, fileName);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.promises.readFile(filePath, { encoding: encoding })];
                    case 2:
                        content = _a.sent();
                        return [2 /*return*/, content];
                    case 3:
                        error_1 = _a.sent();
                        if (error_1.code !== 'ENOENT') {
                            throw error_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    FileManger.prototype.writeToStorage = function (fileName_1, contents_1) {
        return __awaiter(this, arguments, void 0, function (fileName, contents, encoding) {
            var filePath;
            if (encoding === void 0) { encoding = 'utf-8'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path.join(this.storagePath, fileName);
                        return [4 /*yield*/, fs.promises.mkdir(this.storagePath, { recursive: true })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, fs.promises.writeFile(filePath, contents, { encoding: encoding })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileManger.prototype.writeSettingsToStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settingMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settingMap = new Map();
                        this.module.getSettings().allToArray().forEach(function (setting) {
                            settingMap.set(setting.getName(), setting.getValue());
                        });
                        return [4 /*yield*/, this.writeToStorage(this.settingsFileName, JSON.stringify(Object.fromEntries(settingMap), undefined, 4))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileManger;
}());
exports.default = FileManger;
