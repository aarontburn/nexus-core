const fs = require("fs")
const path = require("path")

const PWD = path.join(__dirname, 'src');

if (!process.argv.includes("--verbose")) {
    // Mute all console.log
    console.log = function (message) {
        // original.apply(console, arguments);
    }
}


// These are all the files to copy into the "dist" folder
const pathsToCopy = [
    PWD + "/view",
    PWD + "/built_ins/home_module/HomeHTML.html",
    PWD + "/built_ins/home_module/HomeStyles.css",
    PWD + "/built_ins/settings_module/SettingsHTML.html",
    PWD + "/built_ins/settings_module/SettingsStyles.css",
];

pathsToCopy.forEach(file => {
    console.log("Copying `" + file + "` to `" + file.replace("src", "dist") + "`")

    if (!file.includes(".")) {
        fs.cpSync(file, file.replace("src", "dist"), { recursive: true })
        return;
    }

    fs.copyFileSync(file, file.replace("src", "dist"))
});


if (process.argv.includes('--submodule')) {
    function getDirectoriesRecursive(srcPath) {
        const flatten = (lists) => lists.reduce((a, b) => a.concat(b), []);
        const getDirectories = (parentDir) => fs.readdirSync(parentDir)
            .map(file => path.join(parentDir, file))
            .filter(path => fs.statSync(path).isDirectory())
        return [srcPath, ...flatten(getDirectories(srcPath).map(getDirectoriesRecursive))];
    }

    const subfolders = getDirectoriesRecursive(`${PWD.replace('src', 'dist')}`);
    for (const f of subfolders) {
        const parents = f.split('\\');
        if (parents.at(-1) === 'module_builder' && parents.at(-2) !== 'dist') {
            fs.cpSync(f, PWD.replace('src', 'dist') + '/module_builder/', { recursive: true })
            return;
        }
    }
}


