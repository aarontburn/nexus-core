
import { StorageHandler } from '@nexus/nexus-module-builder';
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
        console.log("Successfully copied " + filePath + ". Restart required.");
        return true;
    }
    console.log("Error copying " + filePath + ".");
    return false;
}

async function importPluginArchive(filePath: string): Promise<boolean> {
    const folderName: string = filePath.split("\\").at(-1);
    try {
        await fs.promises.copyFile(filePath, `${StorageHandler.EXTERNAL_MODULES_PATH}/${folderName}`);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getImportedModules(deletedModules: string[]): Promise<{ name: string, deleted: boolean }[]> {
    const files: fs.Dirent[] = await fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH, { withFileTypes: true });

    const map: Map<string, boolean> = new Map();

    deletedModules.forEach((name: string) => map.set(name, true))

    files.forEach(file => {
        const extension: string = path.extname(file.name);
        if (extension === '.zip') {
            map.set(file.name, false);
        }
    });

    const out: { name: string, deleted: boolean }[] = [];
    map.forEach((deleted: boolean, name: string) => out.push({ name: name, deleted: deleted }));

    return out;
}