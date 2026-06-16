import fs from "fs";

// This should be ran from the root nexus-core directory
// node ./scripts/build-version-checker.js

async function main() {
    const buildPackage = JSON.parse(fs.readFileSync("./nexus/build_package.json", "utf-8"));
    const electronBuilder = JSON.parse(fs.readFileSync("./nexus/electron-builder.yml", "utf-8"));

    const versions = {
        "build_package.json": buildPackage.version,
        "electron-builder.yml": electronBuilder.extraMetadata.version,
        "remote": await getLatestRemoteTagName(),
    }

    if (versions["remote"] === undefined) {
        console.warn("\nWARN: Could not fetch latest remote release version.");
    }

    console.info(`\nVersions found: \n\t` + Object.entries(versions).map(([key, value]) => `${key}: ${value}`).join("\n\t") + "\n");

    if (versions["build_package.json"] !== versions["electron-builder.yml"]) {
        console.error(`ERROR: Build versions in build_package.json and electron-builder.yml don't match.\n`);
        throw `ERROR: Build versions in build_package.json and electron-builder.yml don't match.`;
    }
}

async function getLatestRemoteTagName() {
    try {
        const response = await fetch(`https://api.github.com/repos/aarontburn/nexus-core/releases/latest`);
        const latestRemoteVersion = await response.json();
        return latestRemoteVersion["tag_name"];
    } catch (e) {
        console.error(e)
        return undefined
    }
 
}


main();





