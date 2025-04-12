import * as fs from "fs";
import { DIRECTORIES } from "../utils/nexus-paths";


export async function createAllDirectories() {
    await Promise.allSettled(
        Object.values(DIRECTORIES).map(directory =>
            fs.promises.mkdir(directory, { recursive: true })
        )
    );
}