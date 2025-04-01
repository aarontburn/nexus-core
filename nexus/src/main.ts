import { app, BrowserWindow, Menu } from "electron";
import { ModuleController } from "./ModuleController";

const moduleController: ModuleController = new ModuleController();

// Menu.setApplicationMenu(null);

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










