import { DataResponse, HTTPStatusCodes, IPCSource, Process } from "@nexus-app/nexus-module-builder";
import { BaseWindow, BrowserWindow, MessageChannelMain } from "electron";
import path from 'path';
import showdown from "showdown";

const NOTIFICATION_MANAGER_NAME: string = "Nexus Notification Manager";
export const NOTIFICATION_MANAGER_ID: string = 'nexus.Notification_Manager';

export interface NotificationActionProps {
	text: string;
	action: () => void;
}
export interface NotificationProps {
	sourceModule: IPCSource,
	windowTitle: string;
	markdownContentString: string;
	rejectAction?: NotificationActionProps | undefined;
	resolveAction: NotificationActionProps;
	size?: { width: number, height: number }
}

export class NotificationManagerProcess extends Process {


	public constructor() {
		super({
			moduleID: NOTIFICATION_MANAGER_ID,
			moduleName: NOTIFICATION_MANAGER_NAME,
		});

		this.setModuleInfo({
			name: NOTIFICATION_MANAGER_NAME,
			id: NOTIFICATION_MANAGER_ID,
			version: "1.0.0",
			author: "Nexus",
			description: "A popup notification manager for Nexus",
			link: 'https://github.com/aarontburn/nexus-core',
			build: {
				"build-version": 0,
				process: ''
			},
			platforms: ['win32', 'darwin', "linux"],
		});
	}


	private openDialog(props: NotificationProps) {
		const modalWindow = new BrowserWindow({
			parent: BaseWindow.getAllWindows()[0],
			modal: true,

			width: props.size?.width ?? 800, height: props.size?.height ?? 500,
			frame: false,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				preload: path.join(__dirname, "./view/preload.js")
			}
		});
		modalWindow.loadFile(path.join(__dirname, './view/modal.html'));

		const { port1: remotePort, port2: localPort } = new MessageChannelMain();

		localPort.on('message', (event) => {
			const { eventType, data } = event.data;
			switch (eventType) {
				case "closed":
				case "reject": {
					props.rejectAction.action()
					break;
				}
				case "resolve": {
					props.resolveAction.action()

					break;
				}


				default: {
					console.warn("[Nexus Notification Window] No modal handler found for event: " + eventType)
					break;
				}
			}
		})

		const mdConverter = new showdown.Converter();
		localPort.postMessage({
			initialData: {
				windowTitle: props.windowTitle,
				resolveText: props.resolveAction.text,
				rejectText: props.rejectAction?.text,
				htmlContentString: mdConverter.makeHtml(props.markdownContentString.split("\n").map(line => line.trim()).join("\n")),
				moduleID: props.sourceModule.getIPCSource()
			}
		})
		localPort.start()

		modalWindow.once('ready-to-show', () => {
			modalWindow.webContents.postMessage('main-world-port', null, [remotePort])
		})

	}

	private verifyNotificationProps(props: any): props is NotificationProps {
		if (typeof props !== 'object' || props === null) return false;

		const hasValidAction = (action: any): action is NotificationActionProps => {
			return action &&
				typeof action.text === 'string' &&
				typeof action.action === 'function'

		};

		const hasValidSize = (size: any) => {
			return size &&
				typeof size.width === 'number' &&
				typeof size.height === 'number'
		};

		return typeof props.windowTitle === 'string' &&
			typeof props.markdownContentString === 'string' &&
			hasValidAction(props.resolveAction) &&
			(props.rejectAction === undefined || hasValidAction(props.rejectAction)) &&
			(props.size === undefined || hasValidSize(props.size))

	}

	public async handleExternal(source: IPCSource, eventType: string, data: any[]): Promise<DataResponse> {
		switch (eventType) {
			case "open-dialog": {
				const props: NotificationProps = data[0];

				if (!this.verifyNotificationProps(props)) {
					return { code: HTTPStatusCodes.BAD_REQUEST, body: new Error("Could not open dialog with parameters: " + JSON.stringify(data)) };
				}

				props.sourceModule = source;

				this.openDialog(props);
				return { code: HTTPStatusCodes.OK, body: undefined };

				break;
			}

			default: {
				return { code: HTTPStatusCodes.NOT_IMPLEMENTED, body: undefined };
			}
		}
	}



}


