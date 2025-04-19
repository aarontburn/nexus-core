import { DIRECTORIES } from "@nexus/nexus-module-builder";
import * as fs from "fs";


export async function createAllDirectories() {
    await Promise.allSettled(
        Object.values(DIRECTORIES).map(directory =>
            fs.promises.mkdir(directory, { recursive: true })
        )
    );
}