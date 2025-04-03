const os = require('os');
const path = require("path");
const fs = require("fs");
const dialogNode = require('dialog-node');
const { tryOrUndefined, missingObjectKeys, defaultDevJSON, tryOrUndefinedAsync } = require('./utils');
const archiver = require('archiver')('zip');


if (!process.argv.includes("--verbose")) {
    console.info = (_) => {}
}


// File name of the info file for the module.
const MODULE_INFO_FILE = "module-info.json";

// The path of the root directory of this module.
const PROJECT_ROOT_DIR = path.join(__dirname, "../../../");



const EXPORT_CONFIG_FILE = "export-config.js"
const DEFAULT_EXCLUDED = [
    // "export-config.js"
]

const EXPORT_CONFIG = tryOrUndefined(() => require(path.join(PROJECT_ROOT_DIR, "src/" + EXPORT_CONFIG_FILE)));
if (EXPORT_CONFIG === undefined) {
    throw new Error(`Could not import ${EXPORT_CONFIG_FILE}. Path: ${path.join(PROJECT_ROOT_DIR, "src/" + EXPORT_CONFIG_FILE)}`);
}

const [excludedFiles, addToBuild] = [
    [...DEFAULT_EXCLUDED, ...EXPORT_CONFIG["excluded"] ?? []],
    EXPORT_CONFIG["included"] ?? []
];

const BUILD_CONFIG = EXPORT_CONFIG["build"];
if (BUILD_CONFIG === undefined) {
    throw new Error(`${EXPORT_CONFIG_FILE} missing 'build'.`);
}


const missingKeys = missingObjectKeys(BUILD_CONFIG, ["id", "process", "replace"]);
if (missingKeys.length > 0) {
    throw new Error(`${EXPORT_CONFIG_FILE}.build missing fields: ${missingKeys}`);
}



// The path of the output directory in the output folder
const _OUTPUT_FOLDER_PATH = path.normalize(PROJECT_ROOT_DIR + "/output/" + BUILD_CONFIG["id"] + "/");

// The path to the node_modules directory in the output folder.
const SRC_NODE_MODULES = PROJECT_ROOT_DIR + "/node_modules";

let chosenFolder;

const getOutputFolder = () => {
    if (process.argv.includes('--dev')) {
        return `${os.homedir()}/.nexus_dev/external_modules/${BUILD_CONFIG["id"]}/`;
    }

    return chosenFolder === undefined ? _OUTPUT_FOLDER_PATH : chosenFolder
};

async function main() {
    console.time("Export Time")
    if (!process.argv.includes('--dev')) {
        const outputPath = await getDirectory();
        console.info("Outputting module to: " + outputPath)
        if (outputPath !== undefined) {
            chosenFolder = outputPath;
        }
    }


    await fs.promises.rm(getOutputFolder(), { recursive: true, force: true });
    await modifyModuleInfoJSON();
    await createDirectories();
    await copyFiles();
    await checkAndCopyDependencies();
    await toArchive();
    await fs.promises.rm(getOutputFolder(), { recursive: true, force: true });
    await changeLastExported()

    console.info("\n\tFINISHING BUNDLING MODULE");
    console.timeEnd("Export Time");
}

async function getDirectory() {
    const promise = new Promise((resolve, _) => {
        dialogNode.fileselect('', 'Choose a folder to save your module in.', 0, (_, directory, __) => {
            if (directory === '') {
                resolve(undefined);
            }
            resolve(`${directory.trim()}/${BUILD_CONFIG["id"]}/`);
        });
    })
    return promise;

}

async function modifyModuleInfoJSON() {
    if (process.argv.includes('--dev')) {
        return;
    }
    const jsonPath = PROJECT_ROOT_DIR + "/src/" + MODULE_INFO_FILE;
    const json = JSON.parse(await fs.promises.readFile(jsonPath));
    json["build_version"] += 1
    await fs.promises.writeFile(jsonPath, JSON.stringify(json, undefined, 4));
}

async function createDirectories() {
    async function mkdir(directoryName) {
        await fs.promises.mkdir(directoryName, { recursive: true })
    }

    console.info("\n\tCREATING FOLDERS\n");

    await Promise.all([
        mkdir(getOutputFolder()),
        mkdir(getOutputFolder() + "node_modules"),
    ]);


}

async function copyFiles() {
    console.info("\n\tCOPYING FILES\n");

    const dir = PROJECT_ROOT_DIR + "/src/";
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    await Promise.all(
        files.map(async file => {
            console.info(`Copying '${path.join(file.path, file.name)}' to output folder (${path.join(getOutputFolder(), file.name)})`);
            await fs.promises.cp(path.join(file.path, file.name), path.join(getOutputFolder(), file.name), { recursive: true });
        })
    )

    await Promise.all(
        excludedFiles.map(async file => {
            await fs.promises.rm(path.normalize(path.join(getOutputFolder(), file)), { force: true, recursive: true })
        })
    )

    await Promise.all(
        addToBuild.map(async file => {
            try {
                await fs.promises.cp(path.join(dir, file), path.join(getOutputFolder(), file.split("/").at(-1)), { recursive: true });
            } catch (err) {
                if (file.includes("react_module")) {
                    console.warn("Could not find react_module. If you haven't built your module yet, ignore this error.")
                } else {
                    console.error(err)
                }
            }
        })
    )

    for (const { from, to, at } of BUILD_CONFIG["replace"] ?? []) {
        const replaceTo = to[0] === "%" && to[to.length - 1] === "%" ? BUILD_CONFIG[to.replaceAll("%", '')] : to;

        for (const file of at) {
            const filePath = path.normalize(path.join(getOutputFolder(), file));
            const contents = await fs.promises.readFile(filePath, "utf-8");

            await fs.promises.writeFile(filePath, contents.replaceAll(from, replaceTo));
        }
    }

}



async function checkAndCopyDependencies() {
    const json = JSON.parse(await fs.promises.readFile(PROJECT_ROOT_DIR + "/package.json"));

    const dependencies = json["dependencies"];

    if (!dependencies) {
        return;
    }


    const dependencyNames = Object.keys(dependencies);
    if (dependencyNames.length > 1) {
        console.info("\n\tBUNDLING DEPENDENCIES\n");
    }


    const depSet = new Set()

    const nodeModules = await fs.promises.readdir(SRC_NODE_MODULES);

    for (const dependencyName of dependencyNames) {

        if (!nodeModules.includes(dependencyName)) {
            console.info(dependencyName + " was not found in 'node_modules'. Skipping...")
            continue;
        }

        depSet.add(dependencyName);
        checkDependencysDependencies(dependencyName, depSet);
    }


    await Promise.all(Array.from(depSet).map(async depName => {
        const dependencyPath = path.join(SRC_NODE_MODULES, depName);
        console.info("Copying '" + dependencyPath + "' to '" + getOutputFolder() + "node_modules/'")
        await fs.promises.cp(dependencyPath, path.join(getOutputFolder(), "node_modules/" + depName), { recursive: true });
    }))
}


async function checkDependencysDependencies(depName, depSet) {
    const depDir = path.join(SRC_NODE_MODULES, depName);
    const depJson = path.join(depDir, "package.json");

    const json = JSON.parse(await fs.promises.readFile(depJson));
    const dependencies = json["dependencies"];

    if (dependencies !== undefined) {

        Object.keys(dependencies).forEach(name => {
            depSet.add(name);
            checkDependencysDependencies(name, depSet)
        })
    }
}

async function toArchive() {
    const outputFolder = getOutputFolder();
    const stream = fs.createWriteStream(outputFolder.slice(0, -1) + '.zip');
    console.info("\n\tARCHIVING FOLDER")
    console.info(`From ${outputFolder} to ${outputFolder.slice(0, -1)}.zip`);
    return new Promise((resolve, reject) => {
        archiver
            .directory(outputFolder, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve());
        archiver.finalize();
    });
}


async function changeLastExported() {
    const devPath = path.normalize(os.homedir() + '/.nexus_dev/');
    await fs.promises.mkdir(devPath, { recursive: true });
    let devJSON = await tryOrUndefinedAsync(async () => await fs.promises.readFile(devPath + "/dev.json", "utf-8"));
    if (devJSON === undefined) {
        devJSON = defaultDevJSON;
    } else {
        devJSON = JSON.parse(devJSON)
    }
    devJSON["last_exported_id"] = BUILD_CONFIG["id"];
    await fs.promises.writeFile(devPath + "/dev.json", JSON.stringify(devJSON, undefined, 4));
}





main();