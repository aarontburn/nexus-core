import { DataResponse, HTTPStatusCodes, IPCSource, Process } from "@nexus-app/nexus-module-builder";
import { app } from "electron";
import { autoUpdater, UpdateDownloadedEvent, UpdateInfo } from "electron-updater"
import * as path from "path";
import { InitContext } from "../../utils/types";
import ModuleUpdater, { VersionInfo } from "./module-updater";
import { NOTIFICATION_MANAGER_ID, NotificationProps } from "../notification/notification-process";


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




	private finishedChecking: boolean = false;

	public async beforeWindowCreated(): Promise<void> {
		if ((await this.requestExternal("nexus.Settings", "get-setting", "check_module_updates")).body) {
			await this.moduleUpdater.checkForAllUpdates();
		}

		this.finishedChecking = true;
	}

	public async initialize(): Promise<void> {
		if ((await this.requestExternal("nexus.Settings", "get-setting", "always_update")).body) {
			this.startAutoUpdater()
		}
	}

	private autoUpdaterStarted = false;
	private readonly version: string = process.argv.includes("--dev") ? process.env.npm_package_version : app.getVersion();

	public startAutoUpdater() {
		if (this.autoUpdaterStarted) {
			return;
		}
		this.autoUpdaterStarted = true;

		console.info("[Nexus Auto Updater] Current Nexus Version: " + this.version);
		console.info("[Nexus Auto Updater] Starting auto updater.");

		const TEN_MIN: number = 10 * 60 * 1000;

		if (process.argv.includes("--dev")) {
			autoUpdater.updateConfigPath = path.join(__dirname, '../../view/dev-app-update.yml');
			autoUpdater.forceDevUpdateConfig = true;
		}

		autoUpdater.autoInstallOnAppQuit = false;
		autoUpdater.autoDownload = false;
		autoUpdater.logger = null;
		autoUpdater.disableWebInstaller = true;

		let interval: NodeJS.Timeout = undefined;

		autoUpdater.on('checking-for-update', () => {
			console.info("[Nexus Auto Updater] Checking for update...");
		});

		autoUpdater.on('update-available', (info: UpdateInfo) => {
			this.requestExternal(NOTIFICATION_MANAGER_ID, "open-dialog", {
				windowTitle: "Nexus Update Available",
				size: info.releaseNotes ? { width: 800, height: 500 } : { width: 500, height: 300 },
				markdownContentString: `
						<h2 align="center">Nexus Update Available</h2>

						<p align="center">You're currently using <strong>v${app.getVersion()}</strong>.</p>
						<p align="center">A newer version <strong>v${info.version}</strong> is available.</p>
						<p align="center">Would you like to download it now?</p>

						${info.releaseNotes
						? `
								<h3>Release Notes</h3>
								<div>${info.releaseNotes}</div>
							`
						: ''}

				`,
				resolveAction: {
					text: "Download Now",
					action: () => {
						autoUpdater.downloadUpdate();
					}
				},
				rejectAction: {
					text: "Later",
					action: () => { }
				}
			} satisfies Omit<NotificationProps, "sourceModule">);



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
			console.info(`[Nexus Auto Updater] Release ${event.version} downloaded.`);

			this.requestExternal(NOTIFICATION_MANAGER_ID, "open-dialog", {
				windowTitle: "Restart Required",
				size: { width: 500, height: 300 },
				markdownContentString: `
					<h2 align="center">Nexus ${event.version} Downloaded</h2>

					<p align="center">The latest version has been downloaded.</p>
					<p align="center">Restart now to complete the update process.</p>
				`,
				resolveAction: {
					text: "Restart Now",
					action: () => {
						autoUpdater.quitAndInstall();
					}
				},
				rejectAction: {
					text: "Later",
					action: () => { }
				}
			} satisfies Omit<NotificationProps, "sourceModule">)



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
	public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
		switch (eventType) {
			case "install-module-from-git": {
				const url: string = "https://" + data[0];
				// input url must be in the format github.com/<owner>/<repo>/releases/latest/download/<module_id>.zip
				// notice no https://, added in later

				if (!url.startsWith("https://github.com/") || !url.includes("/releases/latest/download/") || !url.endsWith(".zip")) {
					return { code: HTTPStatusCodes.BAD_REQUEST, body: new Error("Invalid link passed; link can only be in the format 'github.com/<owner>/<repo>/releases/latest/download/<module_id>.zip'") }
				}
				const moduleID: string = url.split("/").at(-1).replace(".zip", '');

				const downloadedSuccess: boolean = await this.moduleUpdater.downloadLatest(moduleID, url);
				if (downloadedSuccess) {
					return {
						code: HTTPStatusCodes.OK, body: {
							moduleID: moduleID
						}
					}
				} else {
					return { code: HTTPStatusCodes.BAD_REQUEST, body: `Could not download module from ${url}` }
				}


				break;
			}

			case "check-for-update": {
				const target: string = data[0] ?? source.getIPCSource();
				if (!this.context.moduleMap.has(target)) {
					return { body: new Error(`No module with the ID of ${target} found.`), code: HTTPStatusCodes.NOT_FOUND };
				}
				try {
					const updateInfo: VersionInfo | undefined = await this.moduleUpdater.checkForUpdate(target);
					return { body: updateInfo, code: HTTPStatusCodes.OK };

				} catch ({ code, message }) {
					return { body: message, code: code };

				}

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

				try {
					const updateInfo: VersionInfo | undefined = await this.moduleUpdater.getLatestRemoteVersion(moduleID);
					if (updateInfo === undefined) {
						return { body: "No latest releases found for " + moduleID, code: HTTPStatusCodes.NO_CONTENT };
					}

					if (force || this.moduleUpdater.compareSemanticVersion(updateInfo.latestVersion, updateInfo.currentVersion) === 1) {
						const successful: boolean = await this.moduleUpdater.downloadLatest(moduleID, updateInfo.url);
						if (!successful) {
							return { body: new Error(`An error occurred while updating ${moduleID}`), code: HTTPStatusCodes.BAD_REQUEST };
						}
					}

					return { body: undefined, code: HTTPStatusCodes.OK };

				} catch ({ code, message }) {
					return { body: message, code: code };
				}

			}


			default: {
				return { code: HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined };
			}
		}
	}



}


