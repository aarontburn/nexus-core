import { DataResponse, HTTPStatusCodes, Process, Setting } from "@nexus-app/nexus-module-builder";
import { BooleanSetting, ChoiceSetting, FileUploadSetting, HexColorSetting, NumberSetting, StringSetting } from "@nexus-app/nexus-module-builder/settings/types";

import * as path from "path";
import { LOCALE, STANDARD_TIME_FORMAT, MILITARY_TIME_FORMAT, FULL_DATE_FORMAT, ABBREVIATED_DATE_FORMAT } from "./utils/time-formats";
import { UPDATER_MODULE_ID } from "../auto-updater/updater-process";
import { app } from "electron";
import { MAIN_ID } from "../../main";


const MODULE_NAME: string = "Home";
export const MODULE_ID: string = 'nexus.Home';
const HTML_PATH: string = path.join(__dirname, "./static/index.html");
const ICON_PATH: string = path.join(__dirname, "../../view/assets/logo-no-background.svg");


export class HomeProcess extends Process {


	private clockTimeout: NodeJS.Timeout;


	public constructor() {
		super({
			moduleID: MODULE_ID,
			moduleName: MODULE_NAME,
			paths: {
				htmlPath: HTML_PATH,
				iconPath: ICON_PATH
			}
		});

		this.setModuleInfo({
			name: MODULE_NAME,
			id: MODULE_ID,
			author: "Nexus",
			version: "1.0.0",
			description: "A home screen that displays time and date.",
			build: {
				"build-version": 1,
				process: '',
			},
			link: 'https://github.com/aarontburn/nexus-core'
		});
	}


	public async initialize(): Promise<void> {
		if (this.getSettings().findSetting("is_first_launch").getValue()) {
			this.sendToRenderer("is-first-launch");

			const installedModules: string[] = (await this.requestExternal(MAIN_ID, "get-module-IDs")).body;

			if (!process.argv.includes('--dev') && !installedModules.includes("aarontburn.Marketplace")) { // check if marketplace is already installed
				await this.requestExternal(UPDATER_MODULE_ID, "install-module-from-git", 'github.com/aarontburn/nexus-marketplace/releases/latest/download/aarontburn.Marketplace.zip')
					.then(async (response: DataResponse) => {
						if (response.code === HTTPStatusCodes.OK) {
							app.relaunch();
							app.quit();

						} else { // error occurred when installed marketplace, ignore and move on
							await this.getSettings().findSetting("is_first_launch").setValue(false);
							await this.fileManager.writeSettingsToStorage();
						}
					});

			} else { // if it already is, proceed
				await this.getSettings().findSetting("is_first_launch").setValue(false);
				await this.fileManager.writeSettingsToStorage();
			}


			return;
		}
		await super.initialize();



		// Start clock
		this.updateDateAndTime(false);

		this.clockTimeout = setTimeout(() => this.updateDateAndTime(true), 1000 - new Date().getMilliseconds());

	}

	public async onExit(): Promise<void> {
		super.onExit();
		clearTimeout(this.clockTimeout);
	}

	private createSpan(text: string): string {
		return `<span style='color: var(--accent-color)'>${text}</span>`;
	}

	public updateDateAndTime(repeat: boolean): void {
		const date: Date = new Date();
		const standardTime: string = date.toLocaleString(LOCALE, STANDARD_TIME_FORMAT);
		const militaryTime: string = date.toLocaleString(LOCALE, MILITARY_TIME_FORMAT);
		const fullDate: string = date.toLocaleString(LOCALE, FULL_DATE_FORMAT);
		const abbreviatedDate: string = date.toLocaleString(LOCALE, ABBREVIATED_DATE_FORMAT);

		const formattedStandardTime: string = standardTime.replace(/:/g, this.createSpan(":"));
		const formattedAbbreviatedDate: string = abbreviatedDate.replace(/\//g, this.createSpan('.'));
		const formattedFullDate: string = fullDate.replace(/,/g, this.createSpan(','));
		const formattedMilitaryTime: string = militaryTime.replace(/:/g, this.createSpan(":"))

		this.sendToRenderer("update-clock", formattedFullDate, formattedAbbreviatedDate, formattedStandardTime, formattedMilitaryTime);

		if (repeat) {
			this.clockTimeout = setTimeout(() => this.updateDateAndTime(true), 1000);
		}
	}


	public registerSettings(): (Setting<unknown> | string)[] {
		return [
			'Date/Time',
			new NumberSetting(this)
				.setStep(5)
				.setMin(0)
				.setName("Full Date Font Size (1)")
				.setDescription("Adjusts the font size of the full date display (e.g. Sunday, January 1st, 2023).")
				.setAccessID("full_date_fs")
				.setDefault(40.0),

			new NumberSetting(this)
				.setStep(5)
				.setMin(0)
				.setName("Abbreviated Date Font Size (2)")
				.setDescription("Adjusts the font size of the abbreviated date display (e.g. 1/01/2023).")
				.setAccessID("abbr_date_fs")
				.setDefault(30.0),

			new NumberSetting(this)
				.setStep(5)
				.setMin(0)
				.setName("Standard Time Font Size (3)")
				.setDescription("Adjusts the font size of the standard time display (e.g. 11:59:59 PM).")
				.setAccessID('standard_time_fs')
				.setDefault(90.0),

			new NumberSetting(this)
				.setStep(5)
				.setMin(0)
				.setName("Military Time Font Size (4)")
				.setDescription("Adjusts the font size of the military time display (e.g. 23:59:49).")
				.setAccessID('military_time_fs')
				.setDefault(30.0),

			"Display",
			new StringSetting(this)
				.setName("Display Order")
				.setDescription("Adjusts the order of the time/date displays.")
				.setDefault("12 34")
				.setAccessID("display_order")
				.setValidator((o) => {
					const s: string = o.toString();
					return s === "" || s.match("^(?!.*(\\d).*\\1)[1-4\\s]+$") ? s : null;
				}),

			new HexColorSetting(this)
				.setName("Text Color")
				.setDefault('#f5f5f5')
				.setAccessID('text_color'),

			new FileUploadSetting(this)
				.setName('Background Image Path')
				.setDefault('')
				.setAccessID('image_path'),

			new ChoiceSetting(this)
				.addOptions("Cover", "Contain")
				.useDropdown()
				.setName("Background Image Mode")
				.setDefault("Cover")
				.setAccessID("background_image_mode")
		];
	}

	public registerInternalSettings(): Setting<unknown>[] {
		return [
			new BooleanSetting(this)
				.setName("First Launch")
				.setAccessID("is_first_launch")
				.setDefault(true),

		]
	}


	private static DATE_TIME_IDS: string[] = ['full_date_fs', 'abbr_date_fs', 'standard_time_fs', 'military_time_fs'];


	public async onSettingModified(modifiedSetting?: Setting<unknown>): Promise<void> {
		if (HomeProcess.DATE_TIME_IDS.includes(modifiedSetting?.getAccessID())) {
			const sizes: object = {
				fullDate: this.getSettings().findSetting('full_date_fs').getValue(),
				abbrDate: this.getSettings().findSetting('abbr_date_fs').getValue(),
				standardTime: this.getSettings().findSetting('standard_time_fs').getValue(),
				militaryTime: this.getSettings().findSetting('military_time_fs').getValue()
			};
			this.sendToRenderer('font-sizes', sizes);

		} else if (modifiedSetting) {
			switch (modifiedSetting.getAccessID()) {
				case "background_image_mode":
				case 'display_order':
				case "text_color":
				case "image_path": {
					this.sendToRenderer(modifiedSetting.getAccessID(), modifiedSetting.getValue());
					break;
				}
			}
		}
	}

	public async handleEvent(eventType: string, data: any[]): Promise<any> {
		switch (eventType) {
			case "init": {
				this.initialize();
				break;
			}

		}
	}
}
