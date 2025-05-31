// @ts-check 

const os = require('os');
const path = require("path");
const fs = require("fs");
const dialogNode = require('dialog-node');
const { tryOrUndefined, defaultDevJSON, tryOrUndefinedAsync } = require('./utils');
const { verifyModuleInfo } = require('./verifier');
const archiver = require('archiver')('zip');

const IS_TESTING = process.argv.includes("--test");
const DEVELOPMENT_MODE = process.argv.includes('--dev');
const EXPORT_TO_DEFAULT_LOCATION = process.argv.includes("--default-location");



if (!process.argv.includes("--verbose")) {
    console.info = () => { }
}

const FILE_NAMES = {
    MODULE_INFO_JSON: "module-info.json",
    NODE_MODULES: IS_TESTING ? "test-node_modules" : "node_modules",
    PACKAGE_JSON: "package.json",
    INTERNAL_JSON: 'internal.json'
}




// The path of the root directory of this module.
const PROJECT_ROOT_DIR = IS_TESTING ? path.join(process.cwd(), "sample-module") : process.cwd();


const MODULE_INFO = JSON.parse(tryOrUndefined(() => fs.readFileSync(path.join(PROJECT_ROOT_DIR, "src", FILE_NAMES.MODULE_INFO_JSON), 'utf8')) ?? {});
if (Object.keys(MODULE_INFO).length === 0) {
    throw new Error(`[Nexus Module Exporter] Could not import ${FILE_NAMES.MODULE_INFO_JSON}. Path: ${path.join(PROJECT_ROOT_DIR, "src",  FILE_NAMES.MODULE_INFO_JSON)}`);

} else if (!verifyModuleInfo(MODULE_INFO)) {
    throw new Error(`[Nexus Module Exporter] ${FILE_NAMES.MODULE_INFO_JSON} contains invalid fields and cannot be exported.`);
}
const BUILD_CONFIG = MODULE_INFO["build"]

const [excludedFiles, addToBuild] = [
    BUILD_CONFIG["excluded"] ?? [],
    BUILD_CONFIG["included"] ?? []
];

// The path to the node_modules directory in the output folder.
const SRC_NODE_MODULES = path.join(PROJECT_ROOT_DIR, FILE_NAMES.NODE_MODULES);

let chosenFolder;

const getOutputFolder = () => {
    const outputDir = path.join(PROJECT_ROOT_DIR, 'output', MODULE_INFO["id"]);

    if (IS_TESTING || EXPORT_TO_DEFAULT_LOCATION) {
        return outputDir;
    }

    if (DEVELOPMENT_MODE) {
        return path.join(os.homedir(), '.nexus_dev', 'external_modules', MODULE_INFO["id"]);
    }

    return chosenFolder;
};

async function main() {
    console.time("[Nexus Module Exporter] Export Time");


    if (!DEVELOPMENT_MODE && !IS_TESTING && !EXPORT_TO_DEFAULT_LOCATION) {
        const outputPath = await chooseOutputDirectory();
        if (outputPath !== undefined) {
            console.info("[Nexus Module Exporter] Outputting module to: " + outputPath)
            chosenFolder = outputPath;

        } else {
            console.warn("[Nexus Module Exporter] Cancelled export.")
            process.exit(0);
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

    console.info("[Nexus Module Exporter]\n\tFINISHING BUNDLING MODULE");
    console.timeEnd("[Nexus Module Exporter] Export Time");
}

async function chooseOutputDirectory() {
    return new Promise((resolve, _) => {
        dialogNode.fileselect('', 'Choose a folder to save your module in.', 0, (_, directory, __) => {
            if (directory === '') {
                resolve(undefined);
            } else {
                resolve(path.join(directory.trim(), MODULE_INFO["id"]));
            }
        });
    })

}

async function modifyModuleInfoJSON() {
    if (DEVELOPMENT_MODE) {
        return;
    }
    const jsonPath = path.join(PROJECT_ROOT_DIR, "src", FILE_NAMES.MODULE_INFO_JSON);
    const json = JSON.parse(await fs.promises.readFile(jsonPath, "utf-8"));
    json['build']["build-version"] += 1
    await fs.promises.writeFile(jsonPath, JSON.stringify(json, undefined, 4));
}

async function createDirectories() {
    async function mkdir(directoryName) {
        await fs.promises.mkdir(directoryName, { recursive: true })
    }

    console.info("[Nexus Module Exporter]\n\tCREATING FOLDERS\n");

    await Promise.all([
        mkdir(getOutputFolder()),
        mkdir(path.join(getOutputFolder(), FILE_NAMES.NODE_MODULES)),
    ]);


}

async function copyFiles() {
    console.info("[Nexus Module Exporter]\n\tCOPYING FILES\n");

    const dir = path.join(PROJECT_ROOT_DIR, "src");
    const files = await fs.promises.readdir(dir, { withFileTypes: true });

    await Promise.all(
        files.map(async file => {
            console.info(`[Nexus Module Exporter] Copying '${path.join(file.path, file.name)}' to output folder (${path.join(getOutputFolder(), file.name)})`);
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
                await fs.promises.cp(path.join(dir, file), path.join(getOutputFolder(), path.basename(file)), { recursive: true });
            } catch (err) {
                if (file.includes("react_module")) {
                    console.warn("[Nexus Module Exporter] Could not find react_module. If you haven't built your module yet, ignore this error.")
                } else {
                    console.error(err)
                }
            }
        })
    )

    for (const { from, to, at } of BUILD_CONFIG["replace"] ?? []) {
        const replaceTo = to[0] === "%" && to[to.length - 1] === "%" ? MODULE_INFO[to.replaceAll("%", '')] : to;

        for (const file of at) {
            const filePath = path.join(getOutputFolder(), file);
            const contents = await fs.promises.readFile(filePath, "utf-8");

            await fs.promises.writeFile(filePath, contents.replaceAll(from, replaceTo));
        }
    }

}



async function checkAndCopyDependencies() {
    const json = JSON.parse(await fs.promises.readFile(path.join(PROJECT_ROOT_DIR, FILE_NAMES.PACKAGE_JSON), "utf-8"));

    const dependencies = json["dependencies"];

    if (!dependencies) {
        return;
    }


    const dependencyNames = Object.keys(dependencies);
    if (dependencyNames.length > 1) {
        console.info("[Nexus Module Exporter]\n\tBUNDLING DEPENDENCIES\n");
    }

    const depSet = new Set()

    for (const dependencyName of dependencyNames) {
        depSet.add(dependencyName);
        await checkDependencyTree(dependencyName, depSet);
    }

    await Promise.all(Array.from(depSet).map(async depName => {
        const dependencyPath = path.join(SRC_NODE_MODULES, depName);
        console.info(`[Nexus Module Exporter] Copying '${dependencyPath}' to ${path.join(getOutputFolder(), FILE_NAMES.NODE_MODULES)}`)
        await fs.promises.cp(dependencyPath, path.join(getOutputFolder(), FILE_NAMES.NODE_MODULES, depName), { recursive: true });
    }))
}


async function checkDependencyTree(depName, depSet) {
    const depDir = path.join(SRC_NODE_MODULES, depName);
    const depJson = path.join(depDir, FILE_NAMES.PACKAGE_JSON);

    const json = JSON.parse(await fs.promises.readFile(depJson, "utf-8"));
    const dependencies = json["dependencies"];

    if (dependencies !== undefined) {
        await Promise.all(
            Object.keys(dependencies).map(name => {
                depSet.add(name);
                return checkDependencyTree(name, depSet);
            })
        );
    }
}

async function toArchive() {
    const outputFolder = getOutputFolder();
    const zipPath = path.resolve(outputFolder, '..', `${MODULE_INFO["id"]}.zip`);

    const stream = fs.createWriteStream(zipPath);
    console.info("[Nexus Module Exporter]\n\tARCHIVING FOLDER")
    console.info(`From ${outputFolder} to ${zipPath}`);
    return new Promise((resolve, reject) => {
        archiver
            .directory(outputFolder, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve(undefined));
        archiver.finalize();
    });
}


async function changeLastExported() {
    if (IS_TESTING) {
        return;
    }

    const devPath = path.join(os.homedir(), '.nexus_dev', 'internal');
    const internalJSONLocation = path.join(devPath, FILE_NAMES.INTERNAL_JSON);

    await fs.promises.mkdir(devPath, { recursive: true });

    let devJSON = await tryOrUndefinedAsync(async () => await fs.promises.readFile(internalJSONLocation, "utf-8"));
    if (devJSON === undefined) {
        devJSON = defaultDevJSON;
    } else {
        devJSON = JSON.parse(devJSON);
    }

    devJSON['args'] = devJSON['args'].replace(/(--last_exported_id:)[^\s]+/, '');
    devJSON['args'] += ` --last_exported_id:${MODULE_INFO["id"]}`;

    await fs.promises.writeFile(internalJSONLocation, JSON.stringify(devJSON, undefined, 4));
}



main();