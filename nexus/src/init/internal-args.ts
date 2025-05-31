import { DIRECTORIES, FILE_NAMES } from "@nexus-app/nexus-module-builder";
import * as fs from "fs";

const DEFAULT_INTERNAL_FILE = {
    "args": '',
}

export async function getInternalArguments(): Promise<string[]> {
    const internal: { [key: string]: any } = await readInternal();
    return await parseInternalArgs(internal);
}

export async function readInternal(): Promise<{ [key: string]: any }> {
    const internalFilePath: string = DIRECTORIES.INTERNAL_PATH + FILE_NAMES.INTERNAL_JSON;

    let parsedContents = { ...DEFAULT_INTERNAL_FILE };
    try {
        const contents: string = await fs.promises.readFile(internalFilePath, "utf8");
        parsedContents = JSON.parse(contents);
    } catch (err) {
        console.warn("Failed to parse internal.json. Reverting to default. Error:", err);
        await fs.promises.writeFile(internalFilePath, JSON.stringify(parsedContents, undefined, 4))
    }
    return parsedContents;
}

export async function writeInternal(args: string[]) {
    await fs.promises.writeFile(
        DIRECTORIES.INTERNAL_PATH + FILE_NAMES.INTERNAL_JSON,
        JSON.stringify(
            {
                args: args.length === 0 ? '' : args.join(' ').trim()
            }, undefined, 4)
    );
}

export async function parseInternalArgs(internal: { [key: string]: any }): Promise<string[]> {
    const args: string[] = [];
    const internalArgs = internal["args"];

    if (internalArgs === undefined) {
        console.warn(`internal.json['args'] is undefined and will be ignored.`);
    } else if (typeof internalArgs !== "string") {
        console.warn(`internal.json['args'] is a non-string and will be ignored.`);
    } else if (internalArgs.trim() === '') {
        // ignore, only whitespace
    } else {
        const unparsedArgs: string[] = internalArgs.split(" ");
        for (const arg of unparsedArgs) {
            if (!arg.startsWith("--")) {
                console.warn(`internal.json['args'] -> ${arg} is not prefixed with '--' and will be ignored.`);
            } else {
                args.push(arg);
            }
        }
    }

    return args;

}