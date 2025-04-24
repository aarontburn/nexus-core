import { Process } from "../Process";
export default class FileManger {
    private readonly storagePath;
    private readonly settingsFileName;
    private readonly module;
    constructor(module: Process);
    readFromStorage(fileName: string, encoding?: BufferEncoding): Promise<string | null>;
    writeToStorage(fileName: string, contents: string, encoding?: BufferEncoding): Promise<void>;
    writeSettingsToStorage(): Promise<void>;
}
