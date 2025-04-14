import { BaseWindow, BrowserWindow, Rectangle, WebContents, WebContentsView } from "electron";
import * as path from "path";
import { InitContext } from "../utils/types";
import { ModuleSettings } from "@nexus/nexus-module-builder/ModuleSettings";
import { WINDOW_DIMENSION } from "../utils/constants";

export async function createBrowserWindow(context: InitContext): Promise<BaseWindow> {
    const window = new BaseWindow({
        show: false,
        height: WINDOW_DIMENSION.height,
        width: WINDOW_DIMENSION.width,
        autoHideMenuBar: true,
    });


    window.on('close', async (event) => {
        event.preventDefault();
        try {
            await Promise.allSettled(
                Array.from(context.moduleMap.values()).map(
                    async module => await module.onExit()
                )
            );
            window.destroy();
        } catch (error) {
            console.error("Error during cleanup:", error);
        }
    })

    const view = new WebContentsView({
        webPreferences: {
            webviewTag: true,
            additionalArguments: [...process.argv, `--module-ID:${context.mainIPCSource.getIPCSource()}`],
            backgroundThrottling: false,
            preload: path.join(__dirname, "../preload.js"),
        }
    });

    window.on('resize', () => {
        context.moduleViewMap.forEach((moduleView: WebContentsView) => {
            moduleView.emit("bounds-changed");
        })
    });

    window.contentView.addChildView(view);
    view.webContents.loadURL("file://" + path.join(__dirname, "../view/index.html"));


    view.on('bounds-changed', () => {
        if (!window || !view) {
            return;
        }
        const bounds: Rectangle = window.getBounds();
        view.setBounds({
            x: 0,
            y: 0,
            width: 70 * view.webContents.zoomFactor,
            height: bounds.height,
        });
    });
    view.setBounds({ x: 0, y: 0, width: 1, height: 1 });

    view.webContents.openDevTools?.({
        mode: "detach"
    })

    context.moduleViewMap.set(context.mainIPCSource.getIPCSource(), view);
    return window;
}

export function createWebViews(context: InitContext) {
    const viewMap: Map<string, WebContentsView> = new Map();
    for (const module of Array.from(context.moduleMap.values())) {
        const view = new WebContentsView({
            webPreferences: {
                webviewTag: true,
                additionalArguments: [...process.argv, `--module-ID:${module.getID()}`],
                backgroundThrottling: false,
                preload: path.join(__dirname, "../preload.js"),
            }
        })
        context.window.contentView.addChildView(view);

        if (module.getHTMLPath()) {
            view.webContents.loadURL("file://" + module.getHTMLPath());
        } else if (module.getURL()) {
            view.webContents.loadURL(module.getURL?.().toString());
        }
        context.moduleViewMap.set(module.getIPCSource(), view);

        view.on('bounds-changed', () => {
            if (!context.window || !view) {
                return;
            }
            const bounds = context.window.getBounds();

            view.setBounds({
                x: 70 * context.moduleViewMap.get(context.mainIPCSource.getIPCSource()).webContents.zoomFactor,
                y: 0,
                width: bounds.width - (70 * context.moduleViewMap.get(context.mainIPCSource.getIPCSource()).webContents.zoomFactor) - 16,
                height: bounds.height,
            });
        });

        view.setVisible(false);
        view.webContents.openDevTools();
        view.setBounds({ x: 0, y: 0, width: 1, height: 1 });
        viewMap.set(module.getIPCSource(), view);
    }
    return viewMap;

}

export function showWindow(context: InitContext) {
    const settings: ModuleSettings = context.settingModule.getSettings();
    context.window.setBounds({
        x: Number(settings.findSetting('window_x').getValue()),
        y: Number(settings.findSetting('window_y').getValue()),
        height: Number(settings.findSetting('window_height').getValue()),
        width: Number(settings.findSetting('window_width').getValue()),
    });

    if ((settings.findSetting('window_maximized').getValue() as boolean) === true) {
        context.window.maximize();
    }
    context.window.show();

}

