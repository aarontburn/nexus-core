import * as fs from "fs";
import { Process } from "./Process";
import { Setting } from "./Setting";
import * as os from "os";


export class StorageHandler {
    public static readonly PATH: string = os.homedir() + (!process.argv.includes('--dev') ? "/.modules/" : '/.modules_dev/');
    public static readonly STORAGE_PATH: string = this.PATH + "/storage/";
    public static readonly EXTERNAL_MODULES_PATH: string = this.PATH + "/external_modules/"
    public static readonly COMPILED_MODULES_PATH: string = this.PATH + "/built/"


    /**
     *  Creates necessary directories. Should not be called by any module.
     */
    public static async _createDirectories(): Promise<void> {
        await Promise.all([
            fs.promises.mkdir(this.PATH, { recursive: true }),
            fs.promises.mkdir(this.STORAGE_PATH, { recursive: true }),
            fs.promises.mkdir(this.EXTERNAL_MODULES_PATH, { recursive: true }),
            fs.promises.mkdir(this.COMPILED_MODULES_PATH, { recursive: true })
        ]);
    }

    /**
     *  Write to a modules storage.
     * 
     *  @param module   The source module. 
     *  @param fileName The name of the file, including file extension.
     *  @param contents The contents to write in the file.
     */
    public static async writeToModuleStorage(module: Process, fileName: string, contents: string): Promise<void> {
        const dirName: string = module.getIPCSource();
        const folderName: string = this.STORAGE_PATH + dirName + "/";
        const filePath: string = folderName + fileName;

        await fs.promises.mkdir(folderName, { recursive: true });
        await fs.promises.writeFile(filePath, contents);
    }

    /**
     *  Writes the module settings to storage.
     * 
     *  @param module The source module.
     */
    public static writeModuleSettingsToStorage(module: Process): void {
        const settingMap: Map<string, any> = new Map();

        module.getSettings().getSettings().forEach((setting: Setting<unknown>) => {
            settingMap.set(setting.getName(), setting.getValue());
        });

        this.writeToModuleStorage(module, module.getSettingsFileName(), JSON.stringify(Object.fromEntries(settingMap), undefined, 4));
    }


    /**
     *  Reads a file from the modules storage.
     * 
     *  @param module   The source module.
     *  @param fileName The name of the file to read.
     *  @param encoding The file encoding. Default is 'utf-8'
     *  @returns        The contents of the file, or null if there was an error reading it.
     */
    public static readFromModuleStorage(module: Process, fileName: string, encoding: string = 'utf-8'): string | null {
        const dirName: string = module.getIPCSource();
        const folderName: string = this.STORAGE_PATH + dirName + "/";
        const filePath: string = folderName + fileName;

        try {
            const content: string = fs.readFileSync(filePath, { encoding: (encoding as BufferEncoding) });
            return content;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }

            console.log("File not found: " + filePath);
        }

        return null;

    }

    /**
     *  Read settings from module storage.
     * 
     *  @param module The source module
     *  @returns A map of setting names to the setting.
     */
    public static readSettingsFromModuleStorage(module: Process): Map<string, any> {
        const settingMap: Map<string, any> = new Map();

        const dirName: string = module.getIPCSource();
        const folderName: string = this.STORAGE_PATH + dirName + "/";
        const filePath: string = folderName + module.getSettingsFileName();


        let contents: string;
        try {
            contents = fs.readFileSync(filePath, 'utf-8');
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }

            console.log("WARNING: directory not found.");
            return settingMap;
        }

        try {
            const json: any = JSON.parse(contents);
            for (const settingName in json) {
                settingMap.set(settingName, json[settingName]);
            }
        } catch (err) {
            console.error("Error parsing JSON for setting: " + module.getName())
        }

        return settingMap;
    }

}