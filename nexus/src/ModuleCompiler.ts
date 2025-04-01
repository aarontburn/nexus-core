import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import * as yauzl from 'yauzl-promise';
import { pipeline } from 'stream/promises';
import { IPCCallback, Process, StorageHandler, ModuleInfo } from "@nexus/nexus-module-builder";


export class ModuleCompiler {
    private static TEMP_ARCHIVE_PATH: string = StorageHandler.EXTERNAL_MODULES_PATH + '/temp/';
    private static readonly IO_OPTIONS: { encoding: BufferEncoding, withFileTypes: true } = {
        encoding: "utf-8",
        withFileTypes: true
    }

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
            const files: fs.Dirent[] = await fs.promises.readdir(this.TEMP_ARCHIVE_PATH, this.IO_OPTIONS);
            for (const folder of files) {
                const builtDirectory: string = StorageHandler.COMPILED_MODULES_PATH + folder.name;
                if (!folder.isDirectory()) {
                    continue;
                }
                const moduleFolderPath: string = `${folder.path}${folder.name}`;
                const skipCompile: boolean = !(await this.shouldRecompileModule(moduleFolderPath, builtDirectory))

                if (!forceReload && skipCompile) {
                    console.log("Skipping compiling of " + folder.name + "; no changes detected.");
                    continue;
                }

                console.log("Removing " + builtDirectory);
                await fs.promises.rm(builtDirectory, { force: true, recursive: true });

                try {
                    await this.compileAndCopyDirectory(moduleFolderPath, builtDirectory);
                } catch (err) {
                    console.error(err)
                }

                if (process.argv.includes("--in-core") || !process.argv.includes("--dev")) {
                    await this.copyFromProd(
                        path.normalize(path.join(__dirname, "../node_modules/@nexus/nexus-module-builder/")),
                        `${builtDirectory}/node_modules/@nexus/nexus-module-builder`
                    );
                } else {
                    await this.copyFromProd(
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
            const folders: fs.Dirent[] = await fs.promises.readdir(StorageHandler.COMPILED_MODULES_PATH, this.IO_OPTIONS);

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

                const moduleInfo: ModuleInfo = await this.getModuleInfo(moduleFolderPath + "/module-info.json");
                const module: any = require(moduleFolderPath + "/" + buildConfig["process"]);
                if (module["default"] === undefined) {
                    console.error(`LOAD ERROR: Process has no default export. Path: ${moduleFolderPath + "/" + buildConfig["process"]}`);
                    continue;
                }

                const m: Process = new module["default"](ipcCallback);

                m.setModuleInfo(moduleInfo);
                externalModules.push(m);

            }


        } catch (err) {
            console.error(err);
        }


        return externalModules;
    }

    private static async getModuleInfo(path: string): Promise<ModuleInfo | null | undefined> {
        try {
            return JSON.parse((await fs.promises.readFile(path)).toString());
        } catch (err) {
            if (err.code !== 'ENOENT') { // File doesn't exist
                console.error(err);
            }
        }
        return undefined;
    }

    /**
     *  Checks if a module should be recompiled.
     * 
     *  @param externalPath 
     *  @param builtPath 
     *  @returns true if the module should be recompiled.
     *  @returns false if the module should NOT be recompiled.
     */
    private static async shouldRecompileModule(externalPath: string, builtPath: string): Promise<boolean> {
        const builtModuleInfo: { [key: string]: any } = await this.getModuleInfo(builtPath + "/module-info.json");
        if (!builtModuleInfo) {
            console.log(`WARNING: ${builtPath} does not contain 'module-info.json'.`);
            return true;
        }

        const moduleInfo: { [key: string]: any } = await this.getModuleInfo(externalPath + "/module-info.json");

        if (!moduleInfo) {
            console.log(`WARNING: ${externalPath} does not contain 'module-info.json'.`);
            return true;
        }

        for (const [key, value] of Object.entries(moduleInfo)) {
            if (builtModuleInfo[key] === undefined || builtModuleInfo[key].toString() !== value.toString()) {
                return true;
            }
        }
        return false;

    }


    private static async unarchiveFromTemp() {
        const files: fs.Dirent[] = await fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH, this.IO_OPTIONS);
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



    private static async compileAndCopyDirectory(readDirectory: string, outputDirectory: string) {
        if (readDirectory.split('/').at(-1) === "node_modules") { // Don't compile directories and just copy over
            await fs.promises.cp(readDirectory, outputDirectory, { force: true, recursive: true });
            return;
        }


        const subFiles: fs.Dirent[] = await fs.promises.readdir(readDirectory, this.IO_OPTIONS);

        await fs.promises.mkdir(outputDirectory, { recursive: true });

        for (const subFile of subFiles) {
            const fullSubFilePath: string = subFile.path + "/" + subFile.name;

            if (path.extname(subFile.name) === ".ts" && !subFile.name.endsWith(".d.ts")) {
                await this.compile(fullSubFilePath, outputDirectory);

            } else if (subFile.isDirectory()) {
                await this.compileAndCopyDirectory(readDirectory + "/" + subFile.name, outputDirectory + "/" + subFile.name);

            } else {
                await fs.promises.copyFile(fullSubFilePath, `${outputDirectory}/${subFile.name}`);
            }

        }
    }


    private static async copyFromProd(sourcePath: string, destinationPath: string) {
        await fs.promises.mkdir(destinationPath, { recursive: true })

        const files: string[] = await fs.promises.readdir(sourcePath);

        for (const file of files) {
            if (!file.includes(".")) {
                await this.copyFromProd(sourcePath + "/" + file, destinationPath + "/" + file);
                continue;
            }

            const fileContents = await fs.promises.readFile(sourcePath + "/" + file);
            await fs.promises.writeFile(destinationPath + "/" + file, fileContents);
        }
    }



    private static async compile(inputFilePath: string, outputDir: string) {
        if (!inputFilePath.endsWith(".ts")) {
            console.log("Skipping " + inputFilePath + ". Not a compilable file (must be .ts)");
            return;
        }

        const inputFileContent: string = await fs.promises.readFile(inputFilePath, 'utf8');
        const { outputText, diagnostics } = ts.transpileModule(inputFileContent, {
            compilerOptions: {
                esModuleInterop: true,
                target: ts.ScriptTarget.ES5,
                module: ts.ModuleKind.CommonJS,
                noImplicitAny: true,
                sourceMap: true,
                baseUrl: ".",
                paths: {
                    "*": ["node_modules/*"]
                }
            }
        });

        if (diagnostics && diagnostics.length > 0) {
            console.error('Compilation errors:');
            diagnostics.forEach(diagnostic => {
                console.error(diagnostic.messageText);
            });
            return;
        }

        const outputFileName: string = path.basename(inputFilePath).replace('.ts', '.js');
        const outputFilePath: string = path.join(outputDir, outputFileName);

        try {
            await fs.promises.mkdir(outputDir, { recursive: true });
            await fs.promises.writeFile(outputFilePath, outputText);
            console.log(`File compiled successfully: ${outputFilePath}`);
        } catch (error) {
            console.error(`Error compiling file: ${error}`);
        }


    }


}