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
const dialogNode = require('dialog-node')
const archiver = require('archiver')(os.platform() !== 'linux' ? 'zip' : 'tar');


// File name of the info file for the module.
const MODULE_INFO_FILE = "moduleinfo.json";




// The path of the root directory of this module.
const PWD = path.join(__dirname, "../", "../");




const FOLDER_NAME = (() => {
    const srcPath = path.join(PWD, "src");
    for (const file of fs.readdirSync(srcPath, { withFileTypes: true })) {
        if (file.isDirectory() && fs.readdirSync(path.join(file.path, file.name)).includes(MODULE_INFO_FILE)) {
            return file.name;
        }
    }
})();

if (FOLDER_NAME === undefined) {
    throw new Error(`Could not locate '${MODULE_INFO_FILE}'. Ensure your module folder contains it.`);
}


const DEFAULT_EXCLUDED = [
    "export-config.js"
]


const EXPORT_CONFIG_FILE = "export-config.js"
const [excludedDirectories, addToBuild] = (() => {
    try {
        const obj = require(`${PWD}src/${FOLDER_NAME}/${EXPORT_CONFIG_FILE}`);
        return [
            [...DEFAULT_EXCLUDED, ...obj["excluded"] ?? []],
            obj["included"] ?? []
        ];
    } catch {
        return [
            [...DEFAULT_EXCLUDED],
            []
        ];
    }
})();

// The path of the output directory in the output folder
const _OUTPUT_FOLDER_PATH = PWD + "/output/" + FOLDER_NAME + "/";

// The path to the node_modules directory in the output folder.
const NODE_MODULES_PATH = PWD + "/node_modules";

const inDev = process.argv.includes('--dev');
if (!process.argv.includes("--verbose")) {
    // Mute all console.log
    console.log = function (message) {
        // original.apply(console, arguments);
    }
}




let chosenFolder;

const getOutputFolder = () => {
    if (inDev) {
        return `${os.homedir()}/.modules_dev/external_modules/${FOLDER_NAME}/`;
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
            resolve(`${directory.trim()}/${FOLDER_NAME}/`);
        });
    })
    return promise;

}

function modifyModuleInfoJSON() {
    if (inDev) {
        return;
    }
    const jsonPath = PWD + "/src/" + FOLDER_NAME + "/" + MODULE_INFO_FILE;
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

    const dir = PWD + "/src/" + FOLDER_NAME + "/";
    for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
        if (excludedDirectories.includes(file.name)) {
            console.log("Excluding " + file.name)
            continue;
        }

        console.log(`Copying '${path.join(file.path, file.name)}' to output folder (${path.join(getOutputFolder(), file.name)})`);
        fs.cpSync(path.join(file.path, file.name), path.join(getOutputFolder(), file.name), { recursive: true });
    }

    for (const file of addToBuild) {
        try {
            fs.cpSync(path.join(dir, file), path.join(getOutputFolder(), file.split("/").at(-1)), { recursive: true });
        } catch (err) {
            console.error(err)
        }
    }
}



function checkAndCopyDependencies() {
    const json = JSON.parse(fs.readFileSync(PWD + "/package.json"));

    const dependencies = json["dependencies"];

    if (!dependencies) {
        return;
    }


    const dependencyNames = Object.keys(dependencies);
    if (dependencyNames.length > 1) {
        console.log("\n\tBUNDLING DEPENDENCIES\n");
    }


    const depSet = new Set()

    const nodeModules = fs.readdirSync(NODE_MODULES_PATH);

    for (const dependencyName of dependencyNames) {
        if (dependencyName === "nexus-module-builder") {
            continue;
        }



        if (!nodeModules.includes(dependencyName)) {
            console.log(dependencyName + " was not found in 'node_modules'. Skipping...")
            continue;
        }

        depSet.add(dependencyName)
        checkDependencysDependencies(dependencyName, depSet)
    }



    depSet.forEach(depName => {
        const dependencyPath = path.join(NODE_MODULES_PATH, depName);
        console.log("Copying '" + dependencyPath + "' to '" + getOutputFolder() + "node_modules/'")
        fs.cpSync(dependencyPath, path.join(getOutputFolder(), "node_modules/" + depName), { recursive: true });
    })
}


function checkDependencysDependencies(depName, depSet) {
    const depDir = path.join(NODE_MODULES_PATH, depName);
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