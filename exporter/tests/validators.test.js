const { validators } = require('../src/validators')

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
        "excluded": [
            "electron.ts"
        ],
        "included": [],
        "process": "./process/main.js",
        "build-version": 1,
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


const singleArgCases = {
    NON_EMPTY_STRING: {
        pass: ['test', ' string', 'string    '],
        fail: [undefined, null, 1, {}, [], '', ' ', '   ']
    },
    VALID_ID: {
        pass: ['developer.Sample_ID', 'test_name.SampleID'],
        fail: [undefined, null, 1, '', ' ', {}, [], 'developer Sample_ID', 'developer..Sample_ID', 'developer!.Sample_ID', 'developer.Sam.ple_ID', 'developer_Sample_ID']
    },
    VALID_VERSION: {
        pass: ['1.0.0', '11.0.0', '1.1.1', '100.100.100'],
        fail: [undefined, null, 1, '', ' ', {}, [], '.0.0', '1..0', '1.0', 'a.b.c', '1.0.1a']
    },
    OPTIONAL_SINGLE_TYPE_ARRAY: {
        pass: [undefined, []],
        fail: [null, 1, '', ' ', {}]
    },
    TYPE_NUMBER: {
        pass: [1, 2, 3, 1.2, 3.5],
        fail: [undefined, null, '', ' ', {}, []]
    },
    TYPE_OBJECT: {
        pass: [{}, { test: 1 }],
        fail: [undefined, null, '', ' ', []]
    },

    VALID_REPLACE: {
        pass: [undefined, [],
            [{ from: "{EXPORTED_MODULE_ID}", to: '%id%', at: ["./process/main.ts"] }],
            [
                { from: "{EXPORTED_MODULE_ID}", to: "%id%", at: ["./process/main.ts"] },
                { from: "{EXPORTED_MODULE_NAME}", to: "%name%", at: ["./process/main.ts", "./module-info.json"] }
            ],
        ],
        fail: [1, null, '', ' ', {}, true, [1],
            [
                { from: "{EXPORTED_MODULE_ID}", to: "%id%", at: ["./process/main.ts"] },
                { from: undefined, to: "%name%", at: ["./process/main.ts", "./module-info.json"] }
            ],
            [{ from: "{EXPORTED_MODULE_ID}", to: '%id%', at: ["./process/main.ts"] }, 1],
            [{ from: "{EXPORTED_MODULE_ID}", to: '%INVALID_KEY%', at: ["./process/main.ts"] }, 1],
            [{ from: undefined, to: "%id%", at: ["./process/main.ts"] }],
            [{ from: 1, to: "%id%", at: ["./process/main.ts"] }],
            [{ from: '', to: "%id%", at: ["./process/main.ts"] }],
            [{ from: "{EXPORTED_MODULE_NAME}", to: undefined, t: ["./process/main.ts"] }],
            [{ from: "{EXPORTED_MODULE_NAME}", to: {}, at: ["./process/main.ts"] }],
        ]
    },
}

const typeCases = {
    SINGLE_TYPE_ARRAY: {
        pass: [
            { type: 'string', cases: ['a', 'b', 'c', '123', '', ' '] },
            { type: 'number', cases: [1, 2, 3, 0, -1, 3.14] },
            { type: 'boolean', cases: [true, false, true] },
            { type: 'object', cases: [{}, { a: 1 }, { b: 'x' }] },
        ],
        fail: [
            { type: 'string', cases: [1, 'a', 'b'] },
            { type: 'number', cases: [1, 2, '3'] },
            { type: 'boolean', cases: [true, false, 'true'] },
            { type: 'object', cases: [{}, [], { a: 1 }] },
        ]
    },

}


function runTests() {
    for (const funcName in singleArgCases) {
        for (const testCase of singleArgCases[funcName].pass) {
            test(`Testing ${funcName} with arg '${typeof testCase === 'object' ? JSON.stringify(testCase) : testCase}'`, () => {
                if (funcName === "VALID_REPLACE") {
                    expect(validators[funcName](validObj, testCase)).toBe(true)
                } else {
                    expect(validators[funcName](testCase)).toBe(true)
                }

            });

        }
        for (const testCase of singleArgCases[funcName].fail) {
            test(`Testing ${funcName} with arg '${typeof testCase === 'object' ? JSON.stringify(testCase) : testCase}'`, () => {
                if (funcName === "VALID_REPLACE") {
                    expect(validators[funcName](validObj, testCase)).toBe(false)
                } else {
                    expect(validators[funcName](testCase)).toBe(false)
                }
            })
        }
    }


    for (const funcName in typeCases) {
        for (const { type, cases } of typeCases[funcName].pass) {
            test(`Testing ${funcName} with arg '${type}: ${typeof cases === 'object' ? JSON.stringify(cases) : cases}'`, () => {
                expect(validators[funcName](cases, type)).toBe(true)
            })
        }

        for (const { type, cases } of typeCases[funcName].fail) {
            test(`Testing ${funcName} with arg '${type}: ${typeof cases === 'object' ? JSON.stringify(cases) : cases}'`, () => {
                expect(validators[funcName](cases, type)).toBe(false)
            })
        }
    }
}

runTests();