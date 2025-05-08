
import { DIRECTORIES } from '@nexus-app/nexus-module-builder';
import { OpenDialogOptions, dialog } from 'electron';
import * as fs from 'fs';
import * as path from "path";



export async function importModuleArchive(): Promise<boolean> {
    const options: OpenDialogOptions = {
        properties: ['openFile'],
        filters: [{ name: 'Nexus Archive File (.zip, .tar)', extensions: ['zip', 'tar'] }]
    };

    const response: Electron.OpenDialogReturnValue = await dialog.showOpenDialog(options);
    if (response.canceled) {
        return undefined;
    }
    const filePath: string = response.filePaths[0];
    const successful: boolean = await importPluginArchive(filePath);

    if (successful) {
        console.info("[Nexus Settings] Successfully copied " + filePath + ". Restart required.");
        return true;
    }
    console.error("[Nexus Settings] Error copying " + filePath + ".");
    return false;
}

async function importPluginArchive(filePath: string): Promise<boolean> {
    const folderName: string = filePath.split("\\").at(-1);
    try {
        await fs.promises.copyFile(filePath, `${DIRECTORIES.EXTERNAL_MODULES_PATH}/${folderName}`);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}



export interface ImportedModuleInfo {
    moduleName: string,
    moduleID: string,
    isDeleted: boolean,
    path: string,
}



export async function getImportedModules(deletedModules: string[]): Promise<ImportedModuleInfo[]> {
    const files: fs.Dirent[] = await fs.promises.readdir(DIRECTORIES.COMPILED_MODULES_PATH, { withFileTypes: true });

    const map: Map<string, ImportedModuleInfo> = new Map();

    files.forEach(file => {
        const buildConfig = require(path.join(file.path, file.name, '/export-config.js')).build;
        const moduleID: string = buildConfig.id;
        const moduleName: string = buildConfig.name;

        map.set(moduleID, {
            path: path.join(file.path, file.name),
            moduleName,
            moduleID,
            isDeleted: false,
        });
    });

    deletedModules.forEach((moduleID: string) => map.set(moduleID, { ...map.get(moduleID), isDeleted: true }))

    const out: ImportedModuleInfo[] = [];
    Array.from(map.values()).forEach(({ moduleName, moduleID, isDeleted, path }) => out.push({ path, moduleName, moduleID, isDeleted }));

    return out;
}