import * as fs from "fs";
import ts from 'typescript';
import * as path from 'path';
import { ModuleInfo } from "@nexus-app/nexus-module-builder";

export const IO_OPTIONS: { encoding: BufferEncoding, withFileTypes: true } = {
    encoding: "utf-8",
    withFileTypes: true
} as const;


export async function copyFromProd(sourcePath: string, destinationPath: string) {
    await fs.promises.mkdir(destinationPath, { recursive: true })

    const files: string[] = await fs.promises.readdir(sourcePath);

    for (const file of files) {
        if (!file.includes(".")) {
            await copyFromProd(sourcePath + "/" + file, destinationPath + "/" + file);
            continue;
        }

        const fileContents = await fs.promises.readFile(sourcePath + "/" + file);
        await fs.promises.writeFile(destinationPath + "/" + file, fileContents);
    }
}


export function isBuildConfigValid(config: any): [boolean, string] {
    if (config["build"] === undefined) {
        return [false, 'build'];
    } else if (config["build"]["id"] === undefined) {
        return [false, 'id'];
    } else if (config["build"]["process"] === undefined) {
        return [false, 'process'];
    }

    return [true, undefined];
}

export async function compile(inputFilePath: string, outputDir: string) {
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


export async function compileAndCopyDirectory(readDirectory: string, outputDirectory: string) {
    if (readDirectory.split('/').at(-1) === "node_modules") { // Don't compile directories and just copy over
        await fs.promises.cp(readDirectory, outputDirectory, { force: true, recursive: true });
        return;
    }


    const subFiles: fs.Dirent[] = await fs.promises.readdir(readDirectory, IO_OPTIONS);

    await fs.promises.mkdir(outputDirectory, { recursive: true });

    for (const subFile of subFiles) {
        const fullSubFilePath: string = subFile.path + "/" + subFile.name;

        if (path.extname(subFile.name) === ".ts" && !subFile.name.endsWith(".d.ts")) {
            await compile(fullSubFilePath, outputDirectory);

        } else if (subFile.isDirectory()) {
            await compileAndCopyDirectory(readDirectory + "/" + subFile.name, outputDirectory + "/" + subFile.name);

        } else {
            await fs.promises.copyFile(fullSubFilePath, `${outputDirectory}/${subFile.name}`);
        }

    }
}

export async function readModuleInfo(path: string): Promise<ModuleInfo | undefined> {
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
export async function shouldRecompileModule(externalPath: string, builtPath: string): Promise<boolean> {
    const builtModuleInfo: { [key: string]: any } = await readModuleInfo(builtPath + "/module-info.json");
    if (!builtModuleInfo) {
        console.log(`WARNING: ${builtPath} does not contain 'module-info.json'.`);
        return true;
    }

    const moduleInfo: { [key: string]: any } = await readModuleInfo(externalPath + "/module-info.json");

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