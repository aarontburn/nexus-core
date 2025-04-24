import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Process } from "../Process";
import { Setting } from "../Setting";


export default class FileManger {

    private readonly storagePath: string;
    private readonly settingsFileName: string;
    private readonly module: Process;


    public constructor(module: Process) {
        this.module = module;
        this.settingsFileName = module.getName().toLowerCase() + "_settings.json";

        this.storagePath = path.join(
            os.homedir(),
            process.argv.includes('--dev') ? '/.nexus_dev/' : "/.nexus/",
            "/storage/", module.getIPCSource(), "/"
        );
    }

    public async readFromStorage(fileName: string, encoding: BufferEncoding = 'utf-8'): Promise<string | null> {
        const filePath: string = path.join(this.storagePath, fileName);

        try {
            const content: string = await fs.promises.readFile(filePath, { encoding: encoding });
            return content;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        return null;
    }

    public async writeToStorage(fileName: string, contents: string, encoding: BufferEncoding = 'utf-8'): Promise<void> {
        const filePath: string = path.join(this.storagePath, fileName);

        await fs.promises.mkdir(this.storagePath, { recursive: true });
        await fs.promises.writeFile(filePath, contents, { encoding: encoding });
    }



    public async writeSettingsToStorage(): Promise<void> {
        const settingMap: Map<string, any> = new Map();
    
        this.module.getSettings().allToArray().forEach((setting: Setting<unknown>) => {
            settingMap.set(setting.getName(), setting.getValue());
        });

        this.writeToStorage(this.settingsFileName, JSON.stringify(Object.fromEntries(settingMap), undefined, 4))
    }
    
}
