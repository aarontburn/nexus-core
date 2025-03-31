import { Process } from "./Process";
export declare class StorageHandler {
    static readonly PATH: string;
    static readonly STORAGE_PATH: string;
    static readonly EXTERNAL_MODULES_PATH: string;
    static readonly COMPILED_MODULES_PATH: string;
    /**
     *  Creates necessary directories. Should not be called by any module.
     */
    static _createDirectories(): Promise<void>;
    /**
     *  Write to a modules storage.
     *
     *  @param module   The source module.
     *  @param fileName The name of the file, including file extension.
     *  @param contents The contents to write in the file.
     */
    static writeToModuleStorage(module: Process, fileName: string, contents: string): Promise<void>;
    /**
     *  Writes the module settings to storage.
     *
     *  @param module The source module.
     */
    static writeModuleSettingsToStorage(module: Process): void;
    /**
     *  Reads a file from the modules storage.
     *
     *  @param module   The source module.
     *  @param fileName The name of the file to read.
     *  @param encoding The file encoding. Default is 'utf-8'
     *  @returns        The contents of the file, or null if there was an error reading it.
     */
    static readFromModuleStorage(module: Process, fileName: string, encoding?: string): string | null;
    /**
     *  Read settings from module storage.
     *
     *  @param module The source module
     *  @returns A map of setting names to the setting.
     */
    static readSettingsFromModuleStorage(module: Process): Map<string, any>;
}
