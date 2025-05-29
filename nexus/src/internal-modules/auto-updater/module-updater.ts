import { DIRECTORIES, ModuleInfo, Process } from "@nexus-app/nexus-module-builder";
import { InitContext } from "../../utils/types";

import { net } from "electron";
import * as fs from "fs";
import { join } from "path";


export interface VersionInfo {
    url: string;
    currentVersion: string;
    latestVersion: string;
}

export default class ModuleUpdater {
    private context: InitContext

    private updates: { [moduleID: string]: VersionInfo };

    constructor(context: InitContext) {
        this.context = context;
    }

    public async checkForAllUpdates() {
        console.info("[Nexus Auto Updater] Checking for module updates...");

        const releases: { [moduleID: string]: VersionInfo } = {};
        await Promise.all(Array.from(this.context.moduleMap.values()).map(async (module: Process) => {
            try {
                const versionInfo: VersionInfo | undefined = await this.getLatestRemoteVersion(module.getID());

                if (versionInfo === undefined) {
                    return;
                }

                // Decide if this should update for all different version or only ascending version
                if (this.compareSemanticVersion(versionInfo.latestVersion, versionInfo.currentVersion) === 1) {
                    releases[module.getID()] = versionInfo;
                }
            } catch ({ code, message }) {
                console.error(`[Nexus Auto Updater] Error when checking for update: ${code} - ${message}`)
            }

        }));
        this.updates = releases;

        console.info(
            "[Nexus Auto Updater] Module updates found:\n" +
            Object.keys(releases)
                .map(moduleID => `\t${moduleID} (${releases[moduleID].currentVersion} => ${releases[moduleID].latestVersion})`)
                .join("\n")
        );
    }

    public getAvailableUpdates(): { [moduleID: string]: VersionInfo } {
        return { ...this.updates }
    }



    public async checkForUpdate(moduleID: string): Promise<VersionInfo | undefined> {
        const versionInfo: VersionInfo | undefined = await this.getLatestRemoteVersion(moduleID);

        if (versionInfo === undefined
            || this.compareSemanticVersion(versionInfo.latestVersion, versionInfo.currentVersion) !== 1) {

            console.info(`[Nexus Auto Updater] No updates found for ${moduleID}.`);
            return undefined;

        } else {
            console.info(`[Nexus Auto Updater] Update found for ${moduleID} (${versionInfo.currentVersion} => ${versionInfo.latestVersion}).`);
            return versionInfo;
        }
    }

    public async downloadLatest(moduleID: string, url: string): Promise<boolean> {
        try {
            console.info(`[Nexus Auto Updater] Downloading new version for ${moduleID} from ${url}`);

            const response: Response = await net.fetch(url);
            const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Remove old version
            const externalFolders: string[] = await fs.promises.readdir(DIRECTORIES.EXTERNAL_MODULES_PATH);
            for (const folderName of externalFolders) {
                if (!folderName.endsWith('.zip')) continue;

                if (folderName.includes(moduleID)) {
                    const pathToFolder: string = join(DIRECTORIES.EXTERNAL_MODULES_PATH, folderName);
                    await fs.promises.rm(pathToFolder, { recursive: true, force: true });
                    console.info(`[Nexus Auto Updater] \tRemoved the old version of ${moduleID}`);
                }
            }

            const filePath = `${DIRECTORIES.EXTERNAL_MODULES_PATH}/${moduleID}.zip`;
            await fs.promises.writeFile(filePath, buffer);
            console.info(`[Nexus Auto Updater] \tSuccessfully downloaded new version for ${moduleID}; will be applied next launch.`);

            return true;
        } catch (err) {
            console.error(`[Nexus Auto Updater] An error occurred while updating ${moduleID}`);
            console.error(err);

        }
        return false;
    }

    // Returns 1 if the version1 is higher, -1 if version2 is higher, 0 if equal
    public compareSemanticVersion(version1: string, version2: string): 1 | 0 | -1 {
        const v1: number[] = version1.split('.').map(part => parseInt(part, 10));
        const v2: number[] = version2.split('.').map(part => parseInt(part, 10));

        for (let i = 0; i < 3; i++) {
            if (v1[i] !== v2[i]) {
                return v1[i] > v2[i] ? 1 : -1;
            }
        }
        return 0;
    }

    public async getLatestRemoteVersion(moduleID: string): Promise<VersionInfo | undefined> {
        const moduleInfo: ModuleInfo | undefined = this.context.moduleMap.get(moduleID)?.getModuleInfo();

        if (moduleInfo === undefined) {
            throw new Error("Attempted to access module info for a module that doesn't exist: " + moduleID);
        }

        if (moduleInfo["git-latest"] &&
            moduleInfo["git-latest"]["git-repo-name"] &&
            moduleInfo["git-latest"]['git-username']) {

            const response = await fetch(`https://api.github.com/repos/${moduleInfo["git-latest"]['git-username']}/${moduleInfo["git-latest"]["git-repo-name"]}/releases/latest`);
            



            if (!response.ok) {


                throw { code: response.status, message: response.statusText };
            }
            const releaseData = await response.json();
            const version: string | undefined = releaseData.tag_name;
            const assets: any[] | undefined = releaseData.assets;

            if (!assets || assets.length === 0) {
                return undefined;
            }
            return {
                currentVersion: moduleInfo.version,
                latestVersion: version,
                url: assets[0].browser_download_url
            }

        }
    }

}