/*
Author: 
    aarontburn (https://github.com/aarontburn)
Title:
    Module Export Script
Purpose:
    Properly export developed module to use with parent application
        (https://github.com/aarontburn/modules)

Repository: 
    https://github.com/aarontburn/modules-export-script
    
Usage: 
    'npm run export', or 'node node_modules/modules-export-script/export.js'
    
Expected Result: 
    In the root directory, a directory 'output/' will be created containing required files for the module.
*/

const os = require('os');
const path = require("path");
const fs = require("fs");
const dialogNode = require('dialog-node');
const { tryOrUndefined, missingObjectKeys } = require('./utils');
const archiver = require('archiver')(os.platform() !== 'linux' ? 'zip' : 'tar');


const inDev = process.argv.includes('--dev');
if (!process.argv.includes("--verbose")) {
    // Mute all console.log
    console.log = function (message) {
        // original.apply(console, arguments);
    }
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

const missingKeys = missingObjectKeys(BUILD_CONFIG, ["id", "process"]);
if (missingKeys.length > 0) {
    throw new Error(`${EXPORT_CONFIG_FILE}.build missing fields: ${missingKeys}`);
}



// The path of the output directory in the output folder
const _OUTPUT_FOLDER_PATH = path.normalize(PROJECT_ROOT_DIR + "/output/" + BUILD_CONFIG["id"] + "/");

// The path to the node_modules directory in the output folder.
const SRC_NODE_MODULES = PROJECT_ROOT_DIR + "/node_modules";

let chosenFolder;

const getOutputFolder = () => {
    if (inDev) {
        return `${os.homedir()}/.nexus_dev/external_modules/${BUILD_CONFIG["id"]}/`;
    }

    return chosenFolder === undefined ? _OUTPUT_FOLDER_PATH : chosenFolder
};

async function main() {
    if (!inDev) {
        const outputPath = await getDirectory();
        console.log("Outputting module to: " + outputPath)
        if (outputPath !== undefined) {
            chosenFolder = outputPath;
        }
    }


    fs.rmSync(getOutputFolder(), { recursive: true, force: true });
    modifyModuleInfoJSON();
    createDirectories();
    copyFiles();
    checkAndCopyDependencies();
    await toArchive();
    fs.rmSync(getOutputFolder(), { recursive: true, force: true });

    console.log("\n\tFINISHING BUNDLING MODULE");
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

function modifyModuleInfoJSON() {
    if (inDev) {
        return;
    }
    const jsonPath = PROJECT_ROOT_DIR + "/src/" + MODULE_INFO_FILE;
    const json = JSON.parse(fs.readFileSync(jsonPath));
    json["build_version"] += 1
    fs.writeFileSync(jsonPath, JSON.stringify(json, undefined, 4));
}

function createDirectories() {
    function mkdir(directoryName) {
        fs.mkdirSync(directoryName, { recursive: true })
    }

    console.log("\n\tCREATING FOLDERS\n");
    mkdir(getOutputFolder());
    mkdir(getOutputFolder() + "node_modules");
}

function copyFiles() {
    console.log("\n\tCOPYING FILES\n");

    const dir = PROJECT_ROOT_DIR + "/src/";
    for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
        console.log(`Copying '${path.join(file.path, file.name)}' to output folder (${path.join(getOutputFolder(), file.name)})`);
        fs.cpSync(path.join(file.path, file.name), path.join(getOutputFolder(), file.name), { recursive: true });
    }

    for (const file of excludedFiles) {
        fs.rmSync(path.normalize(path.join(getOutputFolder(), file)), { force: true, recursive: true })
    }


    for (const file of addToBuild) {
        try {
            fs.cpSync(path.join(dir, file), path.join(getOutputFolder(), file.split("/").at(-1)), { recursive: true });
        } catch (err) {
            if (file.includes("react_module")) {
                console.warn("Could not find react_module. If you haven't built your module yet, ignore this error.")
            } else {
                console.error(err)
            }
        }
    }
}



function checkAndCopyDependencies() {
    const json = JSON.parse(fs.readFileSync(PROJECT_ROOT_DIR + "/package.json"));

    const dependencies = json["dependencies"];

    if (!dependencies) {
        return;
    }


    const dependencyNames = Object.keys(dependencies);
    if (dependencyNames.length > 1) {
        console.log("\n\tBUNDLING DEPENDENCIES\n");
    }


    const depSet = new Set()

    const nodeModules = fs.readdirSync(SRC_NODE_MODULES);

    for (const dependencyName of dependencyNames) {

        if (!nodeModules.includes(dependencyName)) {
            console.log(dependencyName + " was not found in 'node_modules'. Skipping...")
            continue;
        }

        depSet.add(dependencyName)
        checkDependencysDependencies(dependencyName, depSet)
    }



    depSet.forEach(depName => {
        const dependencyPath = path.join(SRC_NODE_MODULES, depName);
        console.log("Copying '" + dependencyPath + "' to '" + getOutputFolder() + "node_modules/'")
        fs.cpSync(dependencyPath, path.join(getOutputFolder(), "node_modules/" + depName), { recursive: true });
    })
}


function checkDependencysDependencies(depName, depSet) {
    const depDir = path.join(SRC_NODE_MODULES, depName);
    const depJson = path.join(depDir, "package.json");

    const json = JSON.parse(fs.readFileSync(depJson));
    const dependencies = json["dependencies"];

    if (dependencies !== undefined) {

        Object.keys(dependencies).forEach(name => {
            depSet.add(name);
            checkDependencysDependencies(name, depSet)
        })
    }
}

function toArchive() {
    const outputFolder = getOutputFolder();
    const stream = fs.createWriteStream(outputFolder.slice(0, -1) + '.zip');
    console.log("\n\tARCHIVING FOLDER")
    console.log(`From ${outputFolder} to ${outputFolder.slice(0, -1)}.zip`);
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





main();