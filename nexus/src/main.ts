import { app, BrowserWindow, globalShortcut, Menu, WebContentsView } from "electron";
import { getInternalArguments, writeInternal } from "./init/internal-args";
import { DataResponse, HTTPStatusCodes, Process } from "@nexus-app/nexus-module-builder";
import { createAllDirectories } from "./init/init-directory-creator";
import { createBrowserWindow, createWebViews, showWindow } from "./init/window-creator";
import { InitContext } from "./utils/types";
import { loadModules, verifyAllModuleSettings } from "./init/module-loader";
import { attachEventHandlerForMain, getIPCCallback, swapVisibleModule } from "./init/global-event-handler";
import { MODULE_ID as SETTINGS_ID, SettingsProcess } from "./internal-modules/settings/process/main";
import { interactWithExternalModules } from "./init/external-module-interfacer";
import path from "path";
import { UPDATER_MODULE_ID as UPDATER_ID } from "./internal-modules/auto-updater/updater-process";
import { NOTIFICATION_MANAGER_ID, NotificationProps } from "./internal-modules/notification/notification-process";

const PROTOCOL: string = "nexus-app";


Menu.setApplicationMenu(null);

app.whenReady().then(() => {
    nexusStart();

    app.on("activate", () => { // MacOS stuff
        if (BrowserWindow.getAllWindows().length === 0) {
            nexusStart();
        }
    });
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient(PROTOCOL)
}

export const MAIN_ID: string = 'nexus.Main'

async function nexusStart() {
    const gotTheLock: boolean = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.exit();
    }


    let processReady: boolean = false;
    let rendererReady: boolean = false;

    const context: InitContext = {
        moduleMap: undefined,
        moduleViewMap: new Map(),
        window: undefined,
        settingModule: undefined,
        ipcCallback: undefined,
        displayedModule: undefined,
        mainIPCSource: {
            getIPCSource() {
                return MAIN_ID;
            },
        },
        setProcessReady: () => {
            processReady = true;
            if (processReady && rendererReady) {
                onProcessAndRendererReady(context);
            }
        },
        setRendererReady: () => {
            rendererReady = true;
            if (processReady && rendererReady) {
                onProcessAndRendererReady(context);
            }
        },
    }

    // Create all directories
    await createAllDirectories();

    // Get internal command line from file and append to process.argv
    const internalArguments: string[] = await getInternalArguments();
    for (const arg of internalArguments) {
        process.argv.push(arg);
    }
    await writeInternal(internalArguments.filter(s => !s.startsWith("--force-reload-module") && !s.startsWith('--last_exported_id')));

    // Load modules
    context.moduleMap = await loadModules(context);
    context.settingModule = context.moduleMap.get(SETTINGS_ID) as SettingsProcess;

    await verifyAllModuleSettings(context);

    context.setProcessReady();



    // Run module preload
    await Promise.allSettled(
        Array.from(context.moduleMap.values()).map(module => { module.beforeWindowCreated() })
    );

    attachEventHandlerForMain(context);

    // Create window
    context.window = await createBrowserWindow(context);

    await createWebViews(context);

    // Register IPC Callback
    context.ipcCallback = getIPCCallback(context);
    attachSingleInstance(context);


    showWindow(context);
}

function attachSingleInstance(context: InitContext) {

    const protocolWithExtension: string = PROTOCOL + "://";
    const onDeepLinkOrSecondInstance = (path: string) => {
        if (path.startsWith(protocolWithExtension)) {
            const data: string = path.slice(protocolWithExtension.length);
            const splitPath: string[] = data.split("_");
            switch (splitPath[0]) {
                case "install": {
                    console.log("Attempting to installing module from " + splitPath.slice(1).join('_'));
                    context.ipcCallback.requestExternalModule(context.mainIPCSource, UPDATER_ID, "install-module-from-git", splitPath.slice(1).join('_'))
                        .then((response: DataResponse) => {
                            if (response.code === HTTPStatusCodes.OK) {
                                context.ipcCallback.requestExternalModule(context.mainIPCSource, NOTIFICATION_MANAGER_ID, "open-dialog", {
                                    windowTitle: "Successfully Installed Module",
                                    size: { width: 500, height: 300 },
                                    markdownContentString: `
                                        <h2 align="center">
                                            Successfully installed ${response.body.moduleID}
                                        </h2>

                                        <p align="center">
                                            You will need to restart Nexus.
                                        </p>

                                        <p align="center">
                                            Restart now?
                                        </p>
                                    `,
                                    rejectAction: {
                                        text: "Later",
                                        action: function (): void {
                                            // do nothing?
                                        }
                                    },
                                    resolveAction: {
                                        text: "Restart",
                                        action: () => {
                                            app.relaunch({
                                                args: process.argv.filter(arg => arg !== path)
                                            });
                                            app.quit();
                                        }
                                    }
                                } satisfies Omit<NotificationProps, "sourceModule">);
                            }

                        });


                    break;
                }
                default: {
                    console.error("No protocol handler found for URL: " + path);
                    break;
                }
            }

        }
    }

    app.on('second-instance', (_, commandLine, __) => {
        // Someone tried to run a second instance, we should focus our window.
        if (context.window) {
            if (context.window.isMinimized()) {
                context.window.restore();
            }
            context.window.focus()
        }

        onDeepLinkOrSecondInstance(commandLine.pop());
    });


    // MacOS deep link compatibility i think
    app.on('open-url', (event, url) => {
        event.preventDefault();
        onDeepLinkOrSecondInstance(url);
    });

    for (const arg of process.argv.filter(arg => arg.startsWith(PROTOCOL))) {
        onDeepLinkOrSecondInstance(arg);
    }
}

function onProcessAndRendererReady(context: InitContext): void {
    if (process.argv.includes("--dev")) {
        globalShortcut.register('Shift+CommandOrControl+I', () => {
            if (!context.window.isFocused()) {
                return;
            }

            const displayedModuleID: string = context.displayedModule.getID();
            context.moduleViewMap.get(displayedModuleID).webContents.openDevTools();
        })
        globalShortcut.register('CommandOrControl+R', () => {
            if (!context.window.isFocused()) {
                return;
            }

            const displayedModuleID: string = context.displayedModule.getID();
            context.moduleViewMap.get(displayedModuleID).webContents.reloadIgnoringCache();
        })
    }


    context.moduleViewMap.forEach((moduleView: WebContentsView) => {
        moduleView.emit("bounds-changed");
    })

    context.displayedModule = undefined;


    const moduleOrder: string = context.settingModule.getSettings()
        .findSetting("module_order")
        .getValue() as string;

    const data: any[] = [];
    context.moduleMap.forEach((module: Process) => {
        data.push({
            moduleName: module.getName(),
            moduleID: module.getIPCSource(),
            htmlPath: module.getHTMLPath(),
            iconPath: module.getIconPath(),
            url: module.getURL()
        });
    });
    context.ipcCallback.notifyRenderer(context.mainIPCSource, 'load-modules', { order: moduleOrder, modules: data });

    let startupModuleID: string = "nexus.Home";

    const openLastModule: boolean = context.settingModule
        .getSettings()
        .findSetting("startup_should_open_last_closed")
        .getValue() as boolean;

    if (openLastModule) {
        startupModuleID = context.settingModule
            .getSettings()
            .findSetting("startup_last_open_id")
            .getValue() as string;
    } else {
        startupModuleID = context.settingModule.getSettings().findSetting("startup_module_id").getValue() as string;
    }

    if (!context.moduleMap.has(startupModuleID)) {
        startupModuleID = "nexus.Home";
    }

    swapVisibleModule(context, startupModuleID);

    context.moduleMap.forEach((module: Process) => {
        if (module.getHTMLPath() === undefined) {
            module.initialize();
        }
    });
    interactWithExternalModules(context);
}




