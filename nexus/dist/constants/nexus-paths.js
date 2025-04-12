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
exports.__esModule = true;
exports.FILE_NAMES = exports.DIRECTORIES = void 0;
var os = __importStar(require("os"));
var STORAGE_ROOT = os.homedir() + (!process.argv.includes('--dev') ? "/.nexus/" : '/.nexus_dev/');
exports.DIRECTORIES = {
    ROOT: STORAGE_ROOT,
    MODULE_STORAGE_PATH: STORAGE_ROOT + "/storage/",
    INTERNAL_PATH: STORAGE_ROOT + "/internal/",
    EXTERNAL_MODULES_PATH: STORAGE_ROOT + "/external_modules/",
    COMPILED_MODULES_PATH: STORAGE_ROOT + "/built/"
};
exports.FILE_NAMES = {
    INTERNAL_JSON: "/internal.json",
    EXPORT_CONFIG: "/export-config.js",
    MODULE_INFO: "/module-info.json"
};
//# sourceMappingURL=nexus-paths.js.map