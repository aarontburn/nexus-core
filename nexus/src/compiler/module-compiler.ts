import * as fs from 'fs';
import * as path from 'path';
import * as yauzl from 'yauzl-promise';
import { pipeline } from 'stream/promises';
import { Process, ModuleInfo, DIRECTORIES } from "@nexus-app/nexus-module-builder";
import { copyFromProd, IO_OPTIONS, compileAndCopyDirectory, readModuleInfo, shouldRecompileModule } from './compiler-utils';
import Stream from 'stream';


export class ModuleCompiler {
    private static TEMP_ARCHIVE_PATH: string = DIRECTORIES.EXTERNAL_MODULES_PATH + '/temp/';

    public static async load(forceReload: boolean = false): Promise<Process[]> {
        console.time("Module Load Time");

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


        let modules: Process[] = [];
        try {
            modules = await this.loadModulesFromBuiltStorage()
        } catch (err) {
            console.error("Error loading modules files");
            console.error(err)
        }
        console.timeEnd("Module Load Time");
        return modules;
    }

    private static async unarchiveFromTemp() {
        const files: fs.Dirent[] = await fs.promises.readdir(DIRECTORIES.EXTERNAL_MODULES_PATH, IO_OPTIONS);

        await fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
        await fs.promises.mkdir(this.TEMP_ARCHIVE_PATH, { recursive: true });

        await Promise.all(
            files.map(async (folder) => {
                const unarchiveDirectory: string = this.TEMP_ARCHIVE_PATH + folder.name.substring(0, folder.name.length - 4);

                if (folder.name.split(".").at(-1) === 'zip') {
                    try {
                        const zip: yauzl.ZipFile = await yauzl.open(path.join(folder.path, folder.name));
                        await fs.promises.mkdir(unarchiveDirectory, { recursive: true });

                        const entryPromises = [];
                        for await (const entry of zip) {
                            const entryPath = `${unarchiveDirectory}/${entry.filename}`;

                            if (entry.filename.endsWith('/')) {
                                entryPromises.push(fs.promises.mkdir(entryPath, { recursive: true }));
                            } else {
                                const dirPath = path.dirname(entryPath);
                                entryPromises.push(
                                    fs.promises.mkdir(dirPath, { recursive: true }).then(async () => {
                                        const readStream: Stream.Readable = await entry.openReadStream();
                                        const writeStream: fs.WriteStream = fs.createWriteStream(entryPath);
                                        return pipeline(readStream, writeStream);
                                    })
                                );
                            }
                        }
                        await Promise.allSettled(entryPromises);
                        await zip.close();
                    } catch (error) {
                        console.error(`Error processing ${folder.name}:`, error);
                    }
                }
            })
        );
    }

    private static async compileAndCopy(forceReload: boolean = false) {
        console.time("compileAndCopy")
        // Read all files within the built directory and external modules directory
        let [builtModules, externalModules]: string[][] = await Promise.all([
            fs.promises.readdir(DIRECTORIES.COMPILED_MODULES_PATH),
            fs.promises.readdir(DIRECTORIES.EXTERNAL_MODULES_PATH)
        ]);

        externalModules = externalModules.map(file => file.split('.').slice(0, -1).join('.')).filter(f => f && f !== 'temp');

        const foldersToRemove: string[] =
            externalModules.length === 0
                ? builtModules
                : builtModules.filter((value) => !externalModules.includes(value));

        await Promise.all(
            foldersToRemove.map(folderName => {
                const folderPath: string = DIRECTORIES.COMPILED_MODULES_PATH + "/" + folderName;
                console.log(`Removing '${folderPath}'`);
                return fs.promises.rm(folderPath, { force: true, recursive: true });
            })
        );


        try {
            const files: fs.Dirent[] = await fs.promises.readdir(this.TEMP_ARCHIVE_PATH, IO_OPTIONS);

            await Promise.allSettled(files.map(async tempFolders => {
                const builtDirectory: string = DIRECTORIES.COMPILED_MODULES_PATH + tempFolders.name; // folder.name is also the module ID
                if (!tempFolders.isDirectory()) {
                    return;
                }
                const modulePathInTempDir: string = `${tempFolders.path}${tempFolders.name}`;

                const shouldRecompile: boolean =
                    process.argv.includes(`--last_exported_id:${tempFolders.name}`) ||
                    await shouldRecompileModule(modulePathInTempDir, builtDirectory)

                if (!forceReload && !shouldRecompile) {
                    console.log("Skipping compiling of " + tempFolders.name + "; no changes detected.");
                    return;
                }

                console.log("Removing " + builtDirectory);
                await fs.promises.rm(builtDirectory, { force: true, recursive: true });

                try {
                    await compileAndCopyDirectory(modulePathInTempDir, builtDirectory);
                } catch (err) {
                    console.error(err)
                }

                if (process.argv.includes("--in-core") || !process.argv.includes("--dev")) {
                    await copyFromProd(
                        path.normalize(path.join(__dirname, "../../node_modules/@nexus-app/nexus-module-builder/")),
                        `${builtDirectory}/node_modules/@nexus-app/nexus-module-builder`)
                } else {
                    await copyFromProd(
                        path.normalize(path.join(__dirname, "../../../@nexus-app/nexus-module-builder/")),
                        `${builtDirectory}/node_modules/@nexus-app/nexus-module-builder`)
                }

                await Promise.allSettled([
                    fs.promises.copyFile(path.join(__dirname, "../view/colors.css"), builtDirectory + "/node_modules/@nexus-app/nexus-module-builder/colors.css"),
                    fs.promises.copyFile(path.join(__dirname, "../view/font.ttf"), builtDirectory + "/node_modules/@nexus-app/nexus-module-builder/font.ttf")
                ]);
            }))

            console.log("All files compiled and copied successfully.");
        } catch (error) {
            console.error("Error:", error);
        }

        await fs.promises.rm(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
        console.timeEnd("compileAndCopy");

    }


    private static async loadModulesFromBuiltStorage(): Promise<Process[]> {
        console.time("loadModulesFromBuiltStorage")


        const externalModules: Process[] = [];

        try {
            const folders: fs.Dirent[] = await fs.promises.readdir(DIRECTORIES.COMPILED_MODULES_PATH, IO_OPTIONS);

            const loadResult: PromiseSettledResult<void>[] = await Promise.allSettled(folders.map(async folder => {
                if (!folder.isDirectory()) { // only read folders
                    return;
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
                    return;
                }

                const moduleInfo: ModuleInfo = await readModuleInfo(moduleFolderPath + "/module-info.json");
                const module: any = require(moduleFolderPath + "/" + buildConfig["process"]);
                if (module["default"] === undefined) {
                    console.error(`LOAD ERROR: Process has no default export. Path: ${moduleFolderPath + "/" + buildConfig["process"]}`);
                    return;
                }

                const m: Process = new module["default"]();

                m.setModuleInfo(moduleInfo);
                externalModules.push(m);
            }));

            const rejected = loadResult.filter(result => result.status === 'rejected');
            if (rejected.length > 0) {
                console.error("Errors occurred during module loading.");
                console.error(rejected)
            }

        } catch (err) {
            console.error(err);
        }

        console.timeEnd("loadModulesFromBuiltStorage");
        return externalModules;
    }











}

