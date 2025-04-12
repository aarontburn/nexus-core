import { session, BrowserWindow } from "electron";
import * as path from "path";
import { InitContext } from "../constants/types";
import { ModuleSettings } from "@nexus/nexus-module-builder/ModuleSettings";
import { WINDOW_DIMENSION } from "../constants/Constants";

export async function createBrowserWindow(context: InitContext): Promise<BrowserWindow> {
    session.defaultSession.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36");

    const window = new BrowserWindow({
        show: false,
        height: WINDOW_DIMENSION.height,
        width: WINDOW_DIMENSION.width,
        autoHideMenuBar: true,
        webPreferences: {
            webviewTag: true,
            additionalArguments: process.argv,
            backgroundThrottling: false,
            preload: path.join(__dirname, "../preload.js"),
        }
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

    window.loadFile(path.join(__dirname, "../view/index.html"))
    return window;
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

