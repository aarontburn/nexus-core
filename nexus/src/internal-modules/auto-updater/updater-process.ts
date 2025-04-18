import { Process } from "@nexus/nexus-module-builder";
import { app } from "electron";
import { autoUpdater, UpdateDownloadedEvent, UpdateInfo } from "electron-updater"
import * as path from "path";


const MODULE_NAME: string = "Nexus Auto Updater";
export const MODULE_ID: string = 'nexus.Auto_Updater';

export class AutoUpdaterProcess extends Process {

	public constructor() {
		super({
			moduleID: MODULE_ID,
			moduleName: MODULE_NAME,
		});

		this.setModuleInfo({
			name: "Auto Updater",
			author: "Nexus",
			version: "1.0.0",
			description: "A home screen that displays time and date.",
			buildVersion: 1,
			platforms: ['win32', 'darwin'],
		});
	}

	private autoUpdaterStarted = false;

	public startAutoUpdater() {
		if (this.autoUpdaterStarted) {
			return;
		}
		this.autoUpdaterStarted = true;
	
		console.info("[Nexus Auto Updater] Current Nexus Version: " + (process.argv.includes("--dev") ? process.env.npm_package_version : app.getVersion()));
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


