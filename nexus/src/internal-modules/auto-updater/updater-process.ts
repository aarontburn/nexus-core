import { DataResponse, HTTPStatusCodes, IPCSource, Process } from "@nexus-app/nexus-module-builder";
import { app } from "electron";
import { autoUpdater, UpdateDownloadedEvent, UpdateInfo } from "electron-updater"
import * as path from "path";
import { InitContext } from "../../utils/types";
import ModuleUpdater, { VersionInfo } from "./module-updater";


const MODULE_NAME: string = "Nexus Auto Updater";
export const MODULE_ID: string = 'nexus.Auto_Updater';

export class AutoUpdaterProcess extends Process {

	private moduleUpdater: ModuleUpdater;
	private context: InitContext;

	public constructor(context: InitContext) {
		super({
			moduleID: MODULE_ID,
			moduleName: MODULE_NAME,
		});
		this.moduleUpdater = new ModuleUpdater(context);
		this.context = context;

		this.setModuleInfo({
			name: MODULE_NAME,
			id: MODULE_ID,
			version: "1.0.0",
			author: "Nexus",
			description: "The Nexus auto-updater and module updater.",
			link: 'https://github.com/aarontburn/nexus-core',
			build: {
				"build-version": 0,
				process: ''
			},
			platforms: ['win32', 'darwin'],
		});

	}

	public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
		switch (eventType) {
			case "check-for-update": {
				const target: string = data[0] ?? source.getIPCSource();
				if (!this.context.moduleMap.has(target)) {
					return { body: new Error(`No module with the ID of ${target} found.`), code: HTTPStatusCodes.NOT_FOUND };
				}
				const updateInfo: VersionInfo | undefined = await this.moduleUpdater.checkForUpdate(target);
				return { body: updateInfo, code: HTTPStatusCodes.OK };
			}

			case "get-all-updates": {
				if (this.finishedChecking) {
					return { body: this.moduleUpdater.getAvailableUpdates(), code: HTTPStatusCodes.OK };
				}

				return new Promise((resolve) => {
					const timeoutMS = 10000;
					const intervalMS = 500;

					const timeout = setTimeout(() => {
						clearInterval(interval);
						resolve({ body: undefined, code: HTTPStatusCodes.LOCKED });
					}, timeoutMS);

					const interval = setInterval(() => {
						if (this.finishedChecking) {
							clearTimeout(timeout);
							clearInterval(interval);
							resolve({ body: this.moduleUpdater.getAvailableUpdates(), code: HTTPStatusCodes.OK });
						}
					}, intervalMS);
				});
			}

			case "update-module": {
				// data[0] should be force or undefined
				// data[1] should be the target module ID or undefined

				// if true, will update regardless of the current version. 
				// if false, will only update if the version is different
				const force: boolean = data[0] === "force";
				const moduleID: string = data[1] ?? source.getIPCSource();

				if (!this.context.moduleMap.has(moduleID)) {
					return { body: new Error(`No module with the ID of ${moduleID} found.`), code: HTTPStatusCodes.NOT_FOUND };
				}

				const updateInfo: VersionInfo | undefined = await this.moduleUpdater.getLatestRemoteVersion(moduleID);
				if (updateInfo === undefined) {
					return { body: "No latest releases found for " + moduleID, code: HTTPStatusCodes.NO_CONTENT };
				}

				if (force || this.moduleUpdater.compareSemanticVersion(updateInfo.latestVersion, updateInfo.currentVersion) === 1) {
					const successful: boolean = await this.moduleUpdater.downloadLatest(moduleID, updateInfo.url);
					if (!successful) {
						return { body: `An error occurred while updating ${moduleID}`, code: HTTPStatusCodes.BAD_REQUEST };
					}
				}

				return { body: undefined, code: HTTPStatusCodes.OK };
			}


			default: {
				return { code: HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined };
			}
		}
	}

	private finishedChecking: boolean = false;

	public async beforeWindowCreated(): Promise<void> {
		await this.moduleUpdater.checkForAllUpdates();
		this.finishedChecking = true;
	}

	private autoUpdaterStarted = false;
	private readonly version: string = process.argv.includes("--dev") ? process.env.npm_package_version : app.getVersion()

	public startAutoUpdater() {
		if (this.autoUpdaterStarted) {
			return;
		}
		this.autoUpdaterStarted = true;

		console.info("[Nexus Auto Updater] Current Nexus Version: " + this.version);
		console.info("[Nexus Auto Updater] Starting auto updater.");

		const TEN_MIN: number = 10 * 60 * 1000;

		if (process.argv.includes("--dev")) {
			autoUpdater.autoDownload = false;
			autoUpdater.autoInstallOnAppQuit = false;
			autoUpdater.updateConfigPath = path.join(__dirname, '../../view/dev-app-update.yml');
			autoUpdater.forceDevUpdateConfig = true;
		}

		autoUpdater.logger = null;
		autoUpdater.disableWebInstaller = true;

		let interval: NodeJS.Timeout = undefined;

		autoUpdater.on('checking-for-update', () => {
			console.info("[Nexus Auto Updater] Checking for update...");
		});

		autoUpdater.on('update-available', (info: UpdateInfo) => {
			const out: string[] = [];
			out.push("[Nexus Auto Updater] Update Found:");

			if (info.releaseName) {
				out.push(`\tRelease Name: ${info.releaseName}`);
			}

			out.push(`\tRelease Date: ${info.releaseDate.split("T")[0]}`);
			out.push(`\tVersion: ${app.getVersion()} => ${info.version}`);

			if (info.releaseNotes) {
				out.push(`\tRelease Notes: ${info.releaseNotes}`);
			}

			console.info("\n" + out.join("\n") + "\n");
			clearInterval(interval);
		});

		autoUpdater.on('update-downloaded', (event: UpdateDownloadedEvent) => {
			console.info(`[Nexus Auto Updater] Release ${event.version} downloaded. This will be installed on next launch.`);
			clearInterval(interval);
		});

		autoUpdater.on('update-cancelled', (event: UpdateInfo) => {
			console.info(`[Nexus Auto Updater] Update cancelled.`);
			clearInterval(interval);
		});

		autoUpdater.on('update-not-available', (info: UpdateInfo) => {
			console.info(`[Nexus Auto Updater] No updates found. Current Version: ${this.version} | Remote Version: ${info.version}`);
			clearInterval(interval);
		})

		autoUpdater.on('error', (err: Error) => {
			console.error("[Nexus Auto Updater] An error occurred while checking for updates: " + err.message);
			clearInterval(interval);
		});

		autoUpdater.checkForUpdates().catch(() => { }); // Ignore errors since this will be handled by the code above, i think?
		interval = setInterval(() => {
			autoUpdater.checkForUpdates().catch(() => { });
		}, TEN_MIN);
	}




}


