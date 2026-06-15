import { DataResponse, DIRECTORIES, HTTPStatusCodes, ModuleInfo, Process } from "@nexus-app/nexus-module-builder";
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

    private updates: { [moduleID: string]: VersionInfo } | undefined;

    constructor(context: InitContext) {
        this.context = context;
    }

    public async checkForAllUpdates() {
        console.info("[Nexus Auto Updater] Checking for module updates...");

        const releases: { [moduleID: string]: VersionInfo } = {};
        await Promise.all(Array.from(this.context.moduleMap.values()).map(async (module: Process) => {
            const response: DataResponse = await this.getLatestRemoteVersion(module.getID());

            if (response.code !== HTTPStatusCodes.OK) {
                console.error(`[Nexus Auto Updater] Error when checking for update: ${response.code} - ${response.body}`);
                return;
            }

            const versionInfo: VersionInfo = response.body;

            // Decide if this should update for all different version or only ascending version
            if (this.compareSemanticVersion(versionInfo.latestVersion, versionInfo.currentVersion) === 1) {
                releases[module.getID()] = versionInfo;
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



    public async checkForUpdate(moduleID: string): Promise<DataResponse> {
        const response: DataResponse = await this.getLatestRemoteVersion(moduleID);

        if (response.code !== HTTPStatusCodes.OK) {
            return response;
        }
        const versionInfo: VersionInfo = response.body;

        if (this.compareSemanticVersion(versionInfo.latestVersion, versionInfo.currentVersion) !== 1) {
            return {
                code: HTTPStatusCodes.NO_CONTENT,
                body: `No update found for ${moduleID}. Current: ${versionInfo.currentVersion} | Remote: ${versionInfo.latestVersion}`
            }

        } else {
            return {
                code: HTTPStatusCodes.OK,
                body: `Update found for ${moduleID}. Current: ${versionInfo.currentVersion} | Remote: ${versionInfo.latestVersion}`
            }
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

    /**
     *  Returns 400 (BAD_REQUEST) if moduleID doesn't exist
     *      body: error string
     * 
     *  Returns 502 (BAD_GATEWAY) if fetch fails
     *      body: a @see Response object from the fetch
     * 
     *  Returns 404 (NOT_FOUND) if there isn't any remote latest release assets
     *      body: error string
     * 
     *  Returns 501 (NOT_IMPLEMENTED) if moduleInfo is missing required fields
     *      body: Missing: <field-1>|<field-2>|<field-3>
     * 
     *  Returns 200 (OK) if successfully retrieved latest version
     *      body: @see VersionInfo
     * 
     * @param moduleID 
     * @returns 
     */
    public async getLatestRemoteVersion(moduleID: string): Promise<DataResponse> {
        const moduleInfo: ModuleInfo | undefined = this.context.moduleMap.get(moduleID)?.getModuleInfo();

        if (moduleInfo === undefined) {
            return {
                body: "Attempted to access module info for a module that doesn't exist: " + moduleID,
                code: HTTPStatusCodes.BAD_REQUEST
            }
        }

        if (moduleInfo["git-latest"] &&
            moduleInfo["git-latest"]["git-repo-name"] &&
            moduleInfo["git-latest"]['git-username']) {

            const response: Response = await fetch(`https://api.github.com/repos/${moduleInfo["git-latest"]['git-username']}/${moduleInfo["git-latest"]["git-repo-name"]}/releases/latest`);
            if (!response.ok) {
                return { code: HTTPStatusCodes.BAD_GATEWAY, body: response };
            }
            const releaseData = await response.json();
            const version: string | undefined = releaseData.tag_name;
            const assets: any[] | undefined = releaseData.assets;

            if (!assets || assets.length === 0) {
                return {
                    body: `No assets found for ${moduleID}`,
                    code: HTTPStatusCodes.NOT_FOUND
                };
            }

            if (!version || version.length === 0) {
                return {
                    body: `No version found for ${moduleID}`,
                    code: HTTPStatusCodes.NOT_FOUND
                };
            }

            const versionInfo: VersionInfo = {
                currentVersion: moduleInfo.version,
                latestVersion: version,
                url: assets[0].browser_download_url
            };

            return {
                code: HTTPStatusCodes.OK,
                body: versionInfo
            }
        }
        const missingFields: string[] = [];
        if (moduleInfo["git-latest"] === undefined) {
            missingFields.push(`${moduleID}.git-latest`);
        } else {
            if (moduleInfo["git-latest"]["git-username"] === undefined) {
                missingFields.push(`${moduleID}.git-latest.git-username`);
            }
            if (moduleInfo["git-latest"]["git-repo-name"] === undefined) {
                missingFields.push(`${moduleID}.git-latest.git-repo-name`)
            }
        }
        return {
            code: HTTPStatusCodes.NOT_IMPLEMENTED,
            body: `Missing: ${missingFields.join("|")}`
        }
    }

}