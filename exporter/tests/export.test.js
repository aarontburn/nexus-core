const { verifyExportConfig } = require("../src/verifier")

const validObj = {
    "name": "Sample TS Module",
    "version": "1.0.0",
    "id": "developer.Sample_TS_Module",
    "author": "developer",
    "description": "A developer template to create a module using vanilla TS and HTML.",
    "link": "https://github.com/aarontburn/modules-template-vanilla-ts",
    "git-latest": {
        "git-username": "git-username",
        "git-repo-name": "repository-name"
    },
    "platforms": [],
    "build": {
        "excluded": ["electron.ts"],
        "included": [],
        "process": "./process/main.js",
        "build_version": 1,
        "replace": [
            {
                "from": "{EXPORTED_MODULE_ID}",
                "to": "%id%",
                "at": [
                    "./process/main.ts"
                ]
            },
            {
                "from": "{EXPORTED_MODULE_NAME}",
                "to": "%name%",
                "at": [
                    "./process/main.ts",
                    "./module-info.json"
                ]
            }
        ]
    }
}

function runTests() {
    test("valid object", () => {
        expect(verifyExportConfig({ ...validObj })).toBe(true)
    });
}
runTests();