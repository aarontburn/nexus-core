
import { DIRECTORIES, FILE_NAMES, ModuleInfo } from '@nexus-app/nexus-module-builder';
import { OpenDialogOptions, dialog } from 'electron';
import * as fs from 'fs';
import * as path from "path";
import { readModuleInfo } from '../../../compiler/compiler-utils';
import { SettingsProcess } from './main';
import { VersionInfo } from '../../auto-updater/module-updater';
import { MAIN_ID } from '../../../main';



export async function importModuleArchive(): Promise<boolean> {
    const options: OpenDialogOptions = {
        properties: ['openFile'],
        filters: [{ name: 'Nexus Module File (.zip)', extensions: ['zip'] }]
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
    const folderName: string = path.basename(path.normalize(filePath));
    try {
        await fs.promises.copyFile(filePath, path.join(DIRECTORIES.EXTERNAL_MODULES_PATH, folderName));
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
    author: string,
    version: string,
    path: string,
    iconPath?: string,
    updateAvailable?: boolean
}



export async function getImportedModules(process: SettingsProcess, availableUpdates: { [moduleID: string]: VersionInfo },  deletedModules: string[]): Promise<ImportedModuleInfo[]> {
    const folders: fs.Dirent[] = await fs.promises.readdir(DIRECTORIES.COMPILED_MODULES_PATH, { withFileTypes: true });

    const map: Map<string, ImportedModuleInfo> = new Map();



    await Promise.all(folders.map(async folder => {
        const moduleInfo: ModuleInfo | undefined = await readModuleInfo(path.join(folder.path, folder.name, FILE_NAMES.MODULE_INFO));
        if (moduleInfo === undefined) {
            return;
        }

        const iconPath: string = (await process.requestExternal(MAIN_ID, 'get-module-icon-path', moduleInfo.id)).body

        map.set(moduleInfo.id, {
            iconPath: iconPath,
            path: path.join(folder.path, folder.name),
            moduleName: moduleInfo.name,
            moduleID: moduleInfo.id,
            author: moduleInfo.author ?? '',
            isDeleted: false,
            version: moduleInfo.version,
            updateAvailable: Object.keys(availableUpdates).includes(moduleInfo.id)
        });
    }));

    deletedModules.forEach((moduleID: string) => map.set(moduleID, { ...map.get(moduleID), isDeleted: true }))

    return Array.from(map.values());
}