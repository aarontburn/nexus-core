import { app, BaseWindow, Rectangle, shell, WebContentsView, screen } from "electron";
import * as path from "path";
import { InitContext } from "../utils/types";
import { ModuleSettings } from "@nexus-app/nexus-module-builder/ModuleSettings";
import { WINDOW_DIMENSION } from "../utils/constants";


const SIDEBAR_COLLAPSED_WIDTH: number = 10;
const SIDEBAR_EXPANDED_WIDTH: number = 70;

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
        icon: path.join(__dirname, `../view/assets/${process.platform === "win32" ? 'icon.ico' : "icon.icns"}`),
        backgroundColor: "#111111",
    });


    window.on('close', async (event) => {
        event.preventDefault();
        await close(context, window);
    })

    window.on('resize', () => {
        context.moduleViewMap.forEach((moduleView: WebContentsView) => {
            moduleView.emit("bounds-changed");
        })
    });

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
            const mainView: (WebContentsView & { collapsed: boolean }) | undefined = context.moduleViewMap.get(context.mainIPCSource.getIPCSource()) as any;

            if (!mainView) {
                return;
            }

            view.setBounds({
                x: (mainView.collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH) * mainView.webContents.zoomFactor,
                y: 0,
                width: bounds.width - ((mainView.collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH) * mainView.webContents.zoomFactor),
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

    const view: WebContentsView & { collapsed: boolean, expanded: boolean } = new WebContentsView({
        webPreferences: {
            webviewTag: true,
            additionalArguments: [...process.argv, `--module-ID:${context.mainIPCSource.getIPCSource()}`],
            backgroundThrottling: false,
            preload: path.join(__dirname, "../preload.js"),
            partition: context.mainIPCSource.getIPCSource(),
            transparent: true
        }
    }) as any;


    let isCollapsed: boolean = false;
    view.collapsed = isCollapsed;
    view.expanded = false;


    context.window.contentView.addChildView(view);
    view.webContents.loadURL("file://" + path.join(__dirname, "../view/index.html"));

    view.on('bounds-changed', () => {
        if (!context.window || !view) {
            return;
        }

        if (view.collapsed !== isCollapsed) {
            isCollapsed = view.collapsed;
            context.ipcCallback.notifyRenderer(context.mainIPCSource, 'collapsed', isCollapsed);
        }

        const bounds: Rectangle = context.window.getContentBounds();

        let width: number;

        if (!view.collapsed) {
            width = SIDEBAR_EXPANDED_WIDTH * view.webContents.zoomFactor;
        } else {
            width = (view.expanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH) * view.webContents.zoomFactor;
        }

        view.setBounds({
            x: 0,
            y: 0,
            width: width,
            height: bounds.height,
        });
    });


    view.setBounds({ x: 0, y: 0, width: 1, height: 1 });
    context.moduleViewMap.set(context.mainIPCSource.getIPCSource(), view);
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


function getSidebarWidth(context: InitContext) {
    // return 70 * 
}
