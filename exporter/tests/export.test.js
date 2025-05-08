const { verifyModuleInfo } = require("../src/verifier")

const validObj = {
    "name": "ChatGPT",
    "id": "aarontburn.ChatGPT",
    "version": "1.0.0",
    "author": "aarontburn",
    "description": "A ChatGPT module for Nexus.",
    "link": "https://github.com/aarontburn/nexus-chatgpt",
    "platforms": [],
    "git-latest": {
        "git-username": "aarontburn",
        "git-repo-name": "nexus-chatgpt"
    },
    "build": {
        "build-version": 1,
        "excluded": ["electron.ts"],
        "included": [],
        "process": "./process/main.js",
        "replace": [
            {
                "from": "{EXPORTED_MODULE_ID}",
                "to": "%id%",
                "at": ["./process/main.ts"]
            },
            {
                "from": "{EXPORTED_MODULE_NAME}",
                "to": "%name%",
                "at": ["./process/main.ts", "./module-info.json"]
            }
        ]
    }

}

function runTests() {
    test("valid object", () => {
        expect(verifyModuleInfo({ ...validObj })).toBe(true)
    });
}
runTests();