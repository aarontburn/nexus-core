import { ModuleInfo } from "@nexus-app/nexus-module-builder";
import { InitContext } from "../../utils/types";


export default class ModuleUpdater {
    private context: InitContext
    constructor(context: InitContext) {
        this.context = context;
    }

    public async initialize() {
        const releases: { [moduleID: string]: { version: string, url: string } } = await this.getAllRemote();


        const shouldUpdateModuleIDs: string[] = [];
        Array.from(this.context.moduleMap.values()).map(module => {
            const currentModuleVersion: string = module.getModuleInfo().version;
            const remoteModuleVersion: string = releases[module.getID()].version;
            if (this.compareSemanticVersion(remoteModuleVersion, currentModuleVersion) === 1) {
                shouldUpdateModuleIDs.push(module.getID())
            }
        })

    }

    // Returns 1 if the version1 is higher
    private compareSemanticVersion(version1: string, version2: string): 1 | 0 | -1 {
        const v1: number[] = version1.split('.').map(part => parseInt(part, 10));
        const v2: number[] = version2.split('.').map(part => parseInt(part, 10));

        for (let i = 0; i < 3; i++) {
            if (v1[i] !== v2[i]) {
                return v1[i] > v2[i] ? 1 : -1;
            }
        }
        return 0
    }

    private async getAllRemote() {
        const releases: { [moduleID: string]: { version: string, url: string } } = {};
        await Promise.allSettled(Array.from(this.context.moduleMap.values()).map(async module => {
            const moduleInfo: ModuleInfo = module.getModuleInfo();

            if (moduleInfo["git-latest"] &&
                moduleInfo["git-latest"]["git-repo-name"] &&
                moduleInfo["git-latest"]['git-username']) {

                try {
                    const response = await fetch(`https://api.github.com/repos/${moduleInfo["git-latest"]['git-username']}/${moduleInfo["git-latest"]["git-repo-name"]}/releases/latest`);

                    if (!response.ok) {
                        throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
                    }
                    const releaseData = await response.json();
                    const version = releaseData.tag_name
                    const assets = releaseData.assets;

                    if (!assets || assets.length === 0) {
                        console.warn("No assets found in the latest release.");
                        return [];
                    }
                    releases[module.getID()] = { url: assets[0].browser_download_url, version: version }
                } catch (error) {
                    console.error("Error fetching latest release:", error);
                }
            }
        }));
        return releases;
    }
}