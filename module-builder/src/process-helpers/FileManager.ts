import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Process } from "../Process";


export default class FileManger {

    private readonly storagePath: string;

    public constructor(module: Process) {
        this.storagePath = path.join(
            os.homedir(),
            process.argv.includes('--dev') ? '/.nexus_dev/' : "/.nexus/",
            "/storage/", module.getIPCSource(), "/"
        );
    }

    private async readFromStorage(fileName: string, encoding: BufferEncoding = 'utf-8'): Promise<string | null> {
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

    private async writeToStorage(fileName: string, contents: string, encoding: BufferEncoding = 'utf-8'): Promise<void> {
        const filePath: string = path.join(this.storagePath, fileName);

        await fs.promises.mkdir(this.storagePath, { recursive: true });
        await fs.promises.writeFile(filePath, contents, { encoding: encoding });
    }
}
