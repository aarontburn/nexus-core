import * as fs from 'fs';
import * as path from 'path';
import * as yauzl from 'yauzl-promise';
import { pipeline } from 'stream/promises';
import { IPCCallback, Process, StorageHandler, ModuleInfo } from "@nexus/nexus-module-builder";
import { copyFromProd, IO_OPTIONS, compileAndCopyDirectory, readModuleInfo, shouldRecompileModule } from './CompilerUtils';


export class ModuleCompiler {
    private static TEMP_ARCHIVE_PATH: string = StorageHandler.EXTERNAL_MODULES_PATH + '/temp/';

    public static async load(ipcCallback: IPCCallback, forceReload: boolean = false): Promise<Process[]> {
        await StorageHandler._createDirectories();

        try {
            await this.unarchiveFromTemp();
        } catch (err) {
            console.error("Error unarchiving files");
            console.error(err)
        }

        try {
            await this.compileAndCopy(forceReload);
        } catch (err) {
            console.error("Error compiling files");
            console.error(err)
        }

        try {
            return await this.loadModulesFromBuiltStorage(ipcCallback);
        } catch (err) {
            console.error("Error loading modules files");
            console.error(err)
        }
        return [];
    }

    private static async unarchiveFromTemp() {
        const files: fs.Dirent[] = await fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH, IO_OPTIONS);
        await fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });

        await fs.promises.mkdir(this.TEMP_ARCHIVE_PATH, { recursive: true });

        for (const folder of files) {
            const unarchiveDirectory: string = this.TEMP_ARCHIVE_PATH + folder.name.substring(0, folder.name.length - 4);

            if (folder.name.split(".").at(-1) === 'zip') {

                const zip: yauzl.ZipFile = await yauzl.open(folder.path + folder.name);
                await fs.promises.mkdir(unarchiveDirectory, { recursive: true });

                try {
                    for await (const entry of zip) {
                        if (entry.filename.endsWith('/')) {
                            await fs.promises.mkdir(`${unarchiveDirectory}/${entry.filename}`);
                        } else {
                            const readStream = await entry.openReadStream();
                            const writeStream = fs.createWriteStream(`${unarchiveDirectory}/${entry.filename}`);
                            await pipeline(readStream, writeStream);
                        }
                    }
                } finally {
                    await zip.close();
                }
            }
        }
    }

    private static async compileAndCopy(forceReload: boolean = false) {
        // Read all files within the built directory and external modules directory
        let [builtModules, externalModules]: string[][] = await Promise.all([
            fs.promises.readdir(StorageHandler.COMPILED_MODULES_PATH),
            fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH)
        ]);

        externalModules = externalModules.map(file => file.split('.').slice(0, -1).join('.')).filter(f => f && f !== 'temp');

        const foldersToRemove: string[] =
            externalModules.length === 0
                ? builtModules
                : builtModules.filter((value) => !externalModules.includes(value));

        await Promise.all(
            foldersToRemove.map(folderName => {
                const folderPath: string = StorageHandler.COMPILED_MODULES_PATH + "/" + folderName;
                console.log(`Removing '${folderPath}'`);
                return fs.promises.rm(folderPath, { force: true, recursive: true });
            })
        );


        try {
            const files: fs.Dirent[] = await fs.promises.readdir(this.TEMP_ARCHIVE_PATH, IO_OPTIONS);
            for (const folder of files) {
                const builtDirectory: string = StorageHandler.COMPILED_MODULES_PATH + folder.name;
                if (!folder.isDirectory()) {
                    continue;
                }
                const moduleFolderPath: string = `${folder.path}${folder.name}`;
                const skipCompile: boolean = !(await shouldRecompileModule(moduleFolderPath, builtDirectory))

                if (!forceReload && skipCompile) {
                    console.log("Skipping compiling of " + folder.name + "; no changes detected.");
                    continue;
                }

                console.log("Removing " + builtDirectory);
                await fs.promises.rm(builtDirectory, { force: true, recursive: true });

                try {
                    await compileAndCopyDirectory(moduleFolderPath, builtDirectory);
                } catch (err) {
                    console.error(err)
                }

                if (process.argv.includes("--in-core") || !process.argv.includes("--dev")) {
                    await copyFromProd(
                        path.normalize(path.join(__dirname, "../node_modules/@nexus/nexus-module-builder/")),
                        `${builtDirectory}/node_modules/@nexus/nexus-module-builder`
                    );
                } else {
                    await copyFromProd(
                        path.normalize(path.join(__dirname, "../../@nexus/nexus-module-builder/")),
                        `${builtDirectory}/node_modules/@nexus/nexus-module-builder`
                    );
                }

                await fs.promises.copyFile(path.join(__dirname, "/view/colors.css"), builtDirectory + "/node_modules/@nexus/nexus-module-builder/colors.css");
                await fs.promises.copyFile(path.join(__dirname, "/view/font.ttf"), builtDirectory + "/node_modules/@nexus/nexus-module-builder/font.ttf");
            }


            console.log("All files compiled and copied successfully.");
        } catch (error) {
            console.error("Error:", error);
        }

        await fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
    }


    private static async loadModulesFromBuiltStorage(ipcCallback: IPCCallback): Promise<Process[]> {
        const externalModules: Process[] = [];

        try {
            const folders: fs.Dirent[] = await fs.promises.readdir(StorageHandler.COMPILED_MODULES_PATH, IO_OPTIONS);

            for (const folder of folders) {
                if (!folder.isDirectory()) { // only read folders
                    continue;
                }

                const moduleFolderPath: string = `${folder.path}/${folder.name}`;

                const buildConfig: { [key: string]: string } = (() => {
                    try {
                        const configPath: string = path.normalize(moduleFolderPath + "/export-config.js")
                        const config = require(configPath)
                        if (config["build"] === undefined) {
                            throw new Error(`${configPath} missing 'build'`)
                        } else if (config["build"]["id"] === undefined) {
                            throw new Error(`${configPath}.build missing 'id'`)
                        } else if (config["build"]["process"] === undefined) {
                            throw new Error(`${configPath}.build missing 'process'`)
                        }

                        return config["build"];
                    } catch (err) {
                        return err;
                    }
                })();

                if (buildConfig instanceof Error) {
                    console.error(buildConfig)
                    continue;
                }

                const moduleInfo: ModuleInfo = await readModuleInfo(moduleFolderPath + "/module-info.json");
                const module: any = require(moduleFolderPath + "/" + buildConfig["process"]);
                if (module["default"] === undefined) {
                    console.error(`LOAD ERROR: Process has no default export. Path: ${moduleFolderPath + "/" + buildConfig["process"]}`);
                    continue;
                }

                const m: Process = new module["default"]();
                m.setIPC(ipcCallback);

                m.setModuleInfo(moduleInfo);
                externalModules.push(m);

            }


        } catch (err) {
            console.error(err);
        }


        return externalModules;
    }











}

