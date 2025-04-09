const fs = require("fs");

const outputDir = __dirname + "/dist";

const packageJSON = __dirname + "/build_package.json";

// Remove old /dist/ folder
fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(outputDir);

fs.copyFileSync(packageJSON, outputDir + "/package.json")

const files = fs.readdirSync(__dirname + "/src");

for (const file of files) {
    fs.copyFileSync(__dirname + "/src/" + file , __dirname + "/dist/" + file)
}