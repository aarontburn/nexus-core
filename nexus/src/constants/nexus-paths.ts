import * as os from "os";


const STORAGE_ROOT: string = os.homedir() + (!process.argv.includes('--dev') ? "/.nexus/" : '/.nexus_dev/');
export const DIRECTORIES = {
    ROOT: STORAGE_ROOT,
    MODULE_STORAGE_PATH: STORAGE_ROOT + "/storage/",
    INTERNAL_PATH: STORAGE_ROOT + "/internal/",
    EXTERNAL_MODULES_PATH: STORAGE_ROOT + "/external_modules/",
    COMPILED_MODULES_PATH: STORAGE_ROOT + "/built/",
}

export const FILE_NAMES = {
    INTERNAL_JSON: "/internal.json",
    EXPORT_CONFIG: "/export-config.js",
    MODULE_INFO: "/module-info.json",
}
