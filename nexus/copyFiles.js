const fs = require("fs")
const path = require("path")

if (!process.argv.includes("--verbose")) {
    console.log = (_) => {};
}

if (process.argv.includes("--pre")) {
    const outputDir = __dirname + "/dist";
    const packageJSON = __dirname + "/build_package.json";
    const README = path.normalize(__dirname + "/../README.md");
    const renderer_d_ts = __dirname + "/renderer.d.ts";
    
    // Remove old /dist/ folder
    fs.rmSync(outputDir, { force: true, recursive: true });
    fs.mkdirSync(outputDir);
    fs.copyFileSync(packageJSON, outputDir + "/package.json");
    fs.copyFileSync(README, outputDir + "/README.md");
    fs.copyFileSync(renderer_d_ts, outputDir + "/renderer.d.ts");
    return
}




const SRC = path.join(__dirname, 'src');

// These are all the files to copy into the "dist" folder
const pathsToCopy = [
    SRC + "/view",
    SRC + "/internal-modules/settings/static",
    SRC + "/internal-modules/home/static",
    SRC + "/internal-modules/home/first-boot/css",
    SRC + "/internal-modules/home/first-boot/html",
    SRC + "/internal-modules/home/first-boot/assets",
    SRC + "/internal-modules/notification/view",
];

pathsToCopy.forEach(file => {
    console.log(`Copying '${file}' to '${file.replace("src", "dist")}'`);

    if (!file.includes(".")) {
        fs.cpSync(file, file.replace("src", "dist"), { recursive: true })
        return;
    }

    fs.copyFileSync(file, file.replace("src", "dist"))
});




