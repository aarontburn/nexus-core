"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_NAMES = exports.DIRECTORIES = void 0;
var os = require("os");
var STORAGE_ROOT = os.homedir() + (!process.argv.includes('--dev') ? "/.nexus/" : '/.nexus_dev/');
exports.DIRECTORIES = {
    ROOT: STORAGE_ROOT,
    MODULE_STORAGE_PATH: STORAGE_ROOT + "/storage/",
    INTERNAL_PATH: STORAGE_ROOT + "/internal/",
    EXTERNAL_MODULES_PATH: STORAGE_ROOT + "/external_modules/",
    COMPILED_MODULES_PATH: STORAGE_ROOT + "/built/",
};
exports.FILE_NAMES = {
    INTERNAL_JSON: "/internal.json",
    MODULE_INFO: "/module-info.json",
};
