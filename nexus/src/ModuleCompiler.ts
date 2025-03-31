import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';
import * as yauzl from 'yauzl-promise';
import { pipeline } from 'stream/promises';
import { IPCCallback, Process, StorageHandler, ModuleInfo } from "nexus-module-builder";


export class ModuleCompiler {
    private static readonly IO_OPTIONS: { encoding: BufferEncoding, withFileTypes: true } = {
        encoding: "utf-8",
        withFileTypes: true
    }


    public static async importPluginArchive(filePath: string): Promise<boolean> {
        const folderName: string = filePath.split("\\").at(-1);
        try {
            await fs.promises.copyFile(filePath, `${StorageHandler.EXTERNAL_MODULES_PATH}/${folderName}`);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public static async loadPluginsFromStorage(ipcCallback: IPCCallback, forceReload: boolean = false): Promise<Process[]> {
        await StorageHandler._createDirectories();
        await this.compileAndCopy(forceReload);

        const externalModules: Process[] = [];

        try {
            const folders: fs.Dirent[] = await fs.promises.readdir(StorageHandler.COMPILED_MODULES_PATH, this.IO_OPTIONS);

            for (const folder of folders) {
                if (!folder.isDirectory()) {
                    continue;
                }

                const moduleFolderPath: string = `${folder.path}/${folder.name}`;
                const subFiles: fs.Dirent[] = await fs.promises.readdir(moduleFolderPath, this.IO_OPTIONS);

                for (const subFile of subFiles) {
                    if (subFile.name.includes("Process")) {
                        const moduleInfo: ModuleInfo = await this.getModuleInfo(subFile.path + "/moduleinfo.json");

                        const module: any = require(subFile.path + "/" + subFile.name);

                        const m: Process = new module[Object.keys(module)[0]](ipcCallback);
                        m.setModuleInfo(moduleInfo);
                        externalModules.push(m);
                    }
                }

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
            if (err.code === 'ENOENT') { // File doesn't exist
                return undefined;
            }
            console.error(err);
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
    private static async checkModuleInfo(externalPath: string, builtPath: string): Promise<boolean> {
        const builtModuleInfo: any = await this.getModuleInfo(builtPath + "/moduleinfo.json");
        if (!builtModuleInfo) {
            if (builtModuleInfo === undefined) {
                console.log(`WARNING: ${builtPath} does not contain 'moduleinfo.json'.`);
            }
            return true;
        }



        const moduleInfo: any = await this.getModuleInfo(externalPath + "/moduleinfo.json");

        if (!moduleInfo) {
            if (moduleInfo === undefined) {
                console.log(`WARNING: ${externalPath} does not contain 'moduleinfo.json'.`);
            }
            return true;
        }

        for (const [key, value] of Object.entries(moduleInfo)) {
            if (builtModuleInfo[key].toString() !== value.toString()) {
                return true;
            }
        }
        return false;

    }

    private static TEMP_ARCHIVE_PATH: string = StorageHandler.EXTERNAL_MODULES_PATH + '/temp/';

    private static async unarchive() {
        const files: fs.Dirent[] = await fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH, this.IO_OPTIONS);
        fs.rmSync(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
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
        await this.unarchive();

        let [compiledModules, moduleArchives]: string[][] = await Promise.all([
            fs.promises.readdir(StorageHandler.COMPILED_MODULES_PATH),
            fs.promises.readdir(StorageHandler.EXTERNAL_MODULES_PATH)
        ]);

        moduleArchives = moduleArchives.map(file => file.split('.').at(-2)).filter(f => f && f !== 'temp');

        const foldersToRemove: string[] = moduleArchives.length === 0
            ? compiledModules
            : compiledModules.filter((value) => !moduleArchives.includes(value));

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

                const skipCompile: boolean = !(await this.checkModuleInfo(moduleFolderPath, builtDirectory))

                if (!forceReload && skipCompile) {
                    console.log("Skipping compiling of " + folder.name + "; no changes detected.");
                    continue;
                }

                console.log("Removing " + builtDirectory);
                await fs.promises.rm(builtDirectory, { force: true, recursive: true });

                await this.compileAndCopyDirectory(moduleFolderPath, builtDirectory);
                const viewFolder: string = path.join(__dirname, "/view");
                const relativeCSSPath: string = path.join(viewFolder, "colors.css");
                const relativeFontPath: string = path.join(viewFolder, "Yu_Gothic_Light.ttf");


                if (process.argv.includes("--in-core")) {
                    await this.copyFromProd(
                        path.normalize(path.join(__dirname, "../node_modules/nexus-module-builder/")),
                        `${builtDirectory}/node_modules/nexus-module-builder`
                    )
                } else {
                    await this.copyFromProd(
                        path.normalize(path.join(__dirname, "../../nexus-module-builder/")),
                        `${builtDirectory}/node_modules/nexus-module-builder`
                    )
                }




                await fs.promises.copyFile(relativeCSSPath, builtDirectory + "/node_modules/nexus-module-builder/colors.css");
                await fs.promises.copyFile(relativeFontPath, builtDirectory + "/node_modules/nexus-module-builder/Yu_Gothic_Light.ttf");


            }


            console.log("All files compiled and copied successfully.");
        } catch (error) {
            console.error("Error:", error);
        }

        fs.rmSync(this.TEMP_ARCHIVE_PATH, { recursive: true, force: true });
    }

    private static async compileAndCopyDirectory(readDirectory: string, outputDirectory: string) {
        const subFiles: fs.Dirent[] = await fs.promises.readdir(readDirectory, this.IO_OPTIONS);

        await fs.promises.mkdir(outputDirectory, { recursive: true });

        for (const subFile of subFiles) {
            const fullSubFilePath: string = subFile.path + "/" + subFile.name;

            if (path.extname(subFile.name) === ".ts" && !subFile.name.endsWith(".d.ts")) {
                await this.compile(fullSubFilePath, outputDirectory);

            } else if (subFile.isDirectory()) {
                await this.compileAndCopyDirectory(readDirectory + "/" + subFile.name, outputDirectory + "/" + subFile.name);

            } else if (path.extname(subFile.name) === ".html") {
                await this.formatHTML(fullSubFilePath, `${outputDirectory}/${subFile.name}`);

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

        const inputFileContent: string = fs.readFileSync(inputFilePath, 'utf8');
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


    private static async formatHTML(htmlPath: string, outputPath: string) {
        const contents: string = (await fs.promises.readFile(htmlPath)).toString();
        const lines: string[] = contents.split("\n")

        for (let i = 0; i < lines.length; i++) {
            switch (lines[i].trim()) {
                case "<!-- @css -->": { // Modify colors.css path
                    const css: string = lines[i + 1].trim();

                    const href: string = css.replace("<", "").replace(">", "").split(" ")[2];
                    if (href.substring(0, 4) !== "href") {
                        throw new Error("Could not parse css line: " + css);
                    }
                    const replacedCSS: string = href.replace("../../", "./node_modules/nexus-module-builder/");
                    const finalCSS: string = `\t<link rel="stylesheet" ${replacedCSS}">`
                    lines[i + 1] = finalCSS

                    break;
                }
            }

        }

        await fs.promises.writeFile(outputPath, lines.join("\n"));

    }






}