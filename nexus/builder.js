const fs = require("fs");

const outputDir = __dirname + "/dist";

const packageJSON = __dirname + "/package.json";

// Remove old /dist/ folder
fs.rmSync(outputDir, { force: true, recursive: true });
fs.mkdirSync(outputDir);

fs.copyFileSync(packageJSON, outputDir + "/package.json")