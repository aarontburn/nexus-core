const fs = require("fs");

const outputDir = __dirname + "/dist";

const packageJSON = __dirname + "/build_package.json";
const readme = __dirname + "/README.md";

// Remove old /dist/ folder
fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(outputDir);

fs.copyFileSync(packageJSON, outputDir + "/package.json")
fs.copyFileSync(readme, outputDir + "/README.md")