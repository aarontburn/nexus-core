import { app, BrowserWindow, Menu, WebContentsView } from "electron";
import { getInternalArguments, writeInternal } from "./init/internal-args";
import { Process } from "@nexus/nexus-module-builder";
import { createAllDirectories } from "./init/init-directory-creator";
import { createBrowserWindow, createWebViews, showWindow } from "./init/window-creator";
import { InitContext } from "./utils/types";
import { loadModules } from "./init/module-loader";
import { attachEventHandlerForMain, getIPCCallback, swapVisibleModule } from "./init/global-event-handler";
import { SettingsProcess } from "./built_ins/settings_module/process/SettingsProcess";
import { interactWithExternalModules } from "./init/external-module-interfacer";


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


async function nexusStart() {
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
                return "built_ins.Main";
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
    await writeInternal(internalArguments);

    // Load modules
    context.moduleMap = await loadModules(context);
    context.settingModule = context.moduleMap.get("built_ins.Settings") as SettingsProcess;

    context.setProcessReady();

    // Run module preload
    await Promise.allSettled(
        Array.from(context.moduleMap.values()).map(module => {  module.beforeWindowCreated()})
    );
    
    attachEventHandlerForMain(context);

    // Create window
    context.window = await createBrowserWindow(context);
    await createWebViews(context);

    // Register IPC Callback
    context.ipcCallback = getIPCCallback(context);


    showWindow(context);
}

function onProcessAndRendererReady(context: InitContext): void {
    context.moduleViewMap.forEach((moduleView: WebContentsView) => {
        moduleView.emit("bounds-changed");
    })
    
    context.displayedModule = undefined;

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
    context.ipcCallback.notifyRenderer(context.mainIPCSource, 'load-modules', data);

    let startupModuleID: string = "built_ins.Home";

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
        startupModuleID = "built_ins.Home";
    }

    swapVisibleModule(context, startupModuleID);

    context.moduleMap.forEach((module: Process) => {
        if (module.getHTMLPath() === undefined) {
            module.initialize();
        }
    });
    interactWithExternalModules(context);
}




