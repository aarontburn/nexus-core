import { app, BaseWindow, Rectangle, shell, WebContentsView } from "electron";
import * as path from "path";
import { InitContext } from "../utils/types";
import { ModuleSettings } from "@nexus-app/nexus-module-builder/ModuleSettings";
import { WINDOW_DIMENSION } from "../utils/constants";


async function close(context: InitContext, window: BaseWindow) {
    let result: PromiseSettledResult<void>[] = await Promise.allSettled(
        Array.from(context.moduleMap.values()).map(
            async module => await module.onExit()
        )
    );
    result = result.filter(p => p.status === 'rejected');

    if (result.length > 0) {
        console.error("Errors occurred during close.");
        for (const error of result) {
            console.error(error);
        }
    }
    window.destroy();
}

export async function createBrowserWindow(context: InitContext): Promise<BaseWindow> {
    const window = new BaseWindow({
        show: false,
        height: WINDOW_DIMENSION.height,
        width: WINDOW_DIMENSION.width,
        autoHideMenuBar: true,
        title: "Nexus",
        icon: path.join(__dirname, "../view/assets/icon.ico"),
        backgroundColor: "#111111",
    });



    window.on('close', async (event) => {
        event.preventDefault();
        await close(context, window);
    })


    const view: WebContentsView = new WebContentsView({
        webPreferences: {
            webviewTag: true,
            additionalArguments: [...process.argv, `--module-ID:${context.mainIPCSource.getIPCSource()}`],
            backgroundThrottling: false,
            preload: path.join(__dirname, "../preload.js"),
            partition: context.mainIPCSource.getIPCSource(),
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

        const bounds: Rectangle = window.getContentBounds();
        view.setBounds({
            x: 0,
            y: 0,
            width: 70 * view.webContents.zoomFactor,
            height: bounds.height,
        });
    });
    view.setBounds({ x: 0, y: 0, width: 1, height: 1 });
    context.moduleViewMap.set(context.mainIPCSource.getIPCSource(), view);
    return window;
}

export function createWebViews(context: InitContext) {
    const viewMap: Map<string, WebContentsView> = new Map();
    for (const module of Array.from(context.moduleMap.values())) {

        const view: WebContentsView = new WebContentsView({
            webPreferences: {
                webviewTag: true,
                additionalArguments: [...process.argv, `--module-ID:${module.getID()}`],
                backgroundThrottling: false,
                preload: path.join(__dirname, "../preload.js"),
                partition: module.getHTTPOptions()?.partition,

            }
        });

        context.window.contentView.addChildView(view);


        if (module.getHTMLPath() || module.getURL()) {
            context.moduleViewMap.set(module.getIPCSource(), view);

            if (module.getHTMLPath()) {
                view.webContents.loadURL("file://" + module.getHTMLPath(), { userAgent: module.getHTTPOptions()?.userAgent });
            } else if (module.getURL()) {
                view.webContents.loadURL(module.getURL?.().toString(), { userAgent: module.getHTTPOptions()?.userAgent });
            }
        }

        view.on('bounds-changed', () => {
            if (!context.window || !view) {
                return;
            }
            const bounds: Rectangle = context.window.getContentBounds();

            view.setBounds({
                x: 70 * context.moduleViewMap.get(context.mainIPCSource.getIPCSource()).webContents.zoomFactor,
                y: 0,
                width: bounds.width - (70 * context.moduleViewMap.get(context.mainIPCSource.getIPCSource()).webContents.zoomFactor),
                height: bounds.height
            });
        });


        view.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });

        view.webContents.on("did-attach-webview", (_, contents) => {
            contents.setWindowOpenHandler((details) => {
                shell.openExternal(details.url);
                return { action: 'deny' };
            });
        });

        view.setVisible(false);
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

