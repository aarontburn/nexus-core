import { IPCSource } from "@nexus/nexus-module-builder";
import { session, BrowserWindow } from "electron";
import { WINDOW_DIMENSION } from "../constants/Constants";
import * as path from "path";

export async function createBrowserWindow(): Promise<BrowserWindow> {
    session.defaultSession.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36");

    const window = new BrowserWindow({
        show: false,
        height: WINDOW_DIMENSION.height,
        width: WINDOW_DIMENSION.width,
        webPreferences: {
            webviewTag: true,
            additionalArguments: process.argv,
            backgroundThrottling: false,
            preload: path.join(__dirname, "../preload.js"),
        },
        autoHideMenuBar: true
    });


    window.on('close', async (event) => {
        event.preventDefault();
        try {
            await this.stop();
            this.window.destroy();
        } catch (error) {
            console.error("Error during cleanup:", error);
        }
    })

    window.loadFile(path.join(__dirname, "../view/index.html")).then(() => {
        window.webContents.on("did-finish-load", () => {
            // this.init();
        });
    });


    // this.ipcCallback = {
    //     notifyRenderer: (target: IPCSource, eventType: string, ...data: any[]) => {
    //         this.window.webContents.send(target.getIPCSource(), eventType, data);
    //     },
    //     requestExternalModule: this.handleInterModuleCommunication.bind(this) // Not sure if the binding is required
    // }
    return window;
}