import { app, BrowserWindow, Menu } from "electron";
import { ModuleController } from "./ModuleController";

const ipcMain: Electron.IpcMain = require('electron').ipcMain;
const moduleController: ModuleController = new ModuleController(ipcMain, process.argv);

if (!process.argv.includes('--dev')) {
    Menu.setApplicationMenu(null);

} else {

}

app.whenReady().then(() => {
    moduleController.start();
    app.on("activate", () => { // MacOS stuff
        if (BrowserWindow.getAllWindows().length === 0) {
            moduleController.start();
        }
    });
});


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});










