import { app, BrowserWindow, Menu } from "electron";
import { ModuleController } from "./ModuleController";
import * as os from "os";
import * as fs from "fs";

const checkLastCompiledModule = () => {
    const DEV_PATH: string = os.homedir() + "/.nexus_dev/dev.json";
    try {
        const devJSON = JSON.parse(fs.readFileSync(DEV_PATH, "utf-8"));
        if (devJSON["last_exported_id"]) {
            process.argv.push(`--last_exported_id:${devJSON["last_exported_id"]}`);
        }
        fs.rmSync(DEV_PATH);
    } catch (_) {
    }
}

if (process.argv.includes("--dev")) {
    checkLastCompiledModule();
    
} else {
    Menu.setApplicationMenu(null);
}



const moduleController: ModuleController = new ModuleController();

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












