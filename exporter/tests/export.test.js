const { verifyExportConfig } = require("../src/verifier")

const validObj = {
    excluded: ["./test path"],
    included: ["./test path"],
    build: {
        name: "Sample TS Module",
        id: "developer.Sample_TS_Module",
        process: "./process/main.js",
        replace: [
            {
                from: "{EXPORTED_MODULE_ID}",
                to: "%id%",
                at: ["./process/main.ts"]
            },
            {
                from: "{EXPORTED_MODULE_NAME}",
                to: "%name%",
                at: ["./process/main.ts", "./module-info.json"]
            }
        ]
    }
}

function runTests() {
    console.error = () => { }

    test("valid object", () => {
        expect(verifyExportConfig({ ...validObj })).toBe(true)
    });

    testExcluded();
    testIncluded()
    testBuild();


}

function testExcluded() {
    test("excluded undefined", () => {
        expect(verifyExportConfig({ ...validObj, excluded: undefined })).toBe(true)
    })
    test("excluded is an empty array", () => {
        expect(verifyExportConfig({ ...validObj, excluded: [] })).toBe(true)
    })
    test("excluded contains a non string", () => {
        expect(verifyExportConfig({ ...validObj, excluded: [1] })).toBe(false)
    })
    test("excluded contains both a string an non string", () => {
        expect(verifyExportConfig({ ...validObj, excluded: [1, "./test oath"] })).toBe(false)
    })
}

function testIncluded() {
    test("included undefined", () => {
        expect(verifyExportConfig({ ...validObj, included: [] })).toBe(true)
    });
    test("included is an empty array", () => {
        expect(verifyExportConfig({ ...validObj, included: undefined })).toBe(true)
    });
    test("included contains a non string", () => {
        expect(verifyExportConfig({ ...validObj, included: [1] })).toBe(false)
    });
    test("included contains both a string an non string", () => {
        expect(verifyExportConfig({ ...validObj, included: [1, "./test oath"] })).toBe(false)
    });
}

function testBuild() {
    test("build undefined", () => {
        expect(verifyExportConfig({ ...validObj, build: undefined })).toBe(false)
    });

    test("build non string: number", () => {
        expect(verifyExportConfig({ ...validObj, build: 1 })).toBe(false)
    });

    test("build non string: array", () => {
        expect(verifyExportConfig({ ...validObj, build: ["test"] })).toBe(false)
    });

    testBuildName();
    testBuildID();
    testBuildProcess();
    testBuildReplace()
}

function testBuildName() {
    const b = (params) => { return { ...validObj, build: { ...validObj.build, ...params } } }

    test("build.name undefined", () => {
        expect(verifyExportConfig(b({ name: undefined }))).toBe(false)
    });

    test("build.name non string: number", () => {
        expect(verifyExportConfig(b({ name: 1 }))).toBe(false)
    });

    test("build.name non string: object", () => {
        expect(verifyExportConfig(b({ name: {} }))).toBe(false)
    });

    test("build.name non string: array", () => {
        expect(verifyExportConfig(b({ name: [] }))).toBe(false)
    });

    test("build.name empty string", () => {
        expect(verifyExportConfig(b({ name: '' }))).toBe(false)
    });

    test("build.name white space only", () => {
        expect(verifyExportConfig(b({ name: '  \t' }))).toBe(false)
    });
}

function testBuildID() {
    const b = (params) => { return { ...validObj, build: { ...validObj.build, ...params } } }

    test("build.id valid id", () => {
        expect(verifyExportConfig(b({ id: 'developer.Sample_ID' }))).toBe(true)
    });

    test("build.id undefined", () => {
        expect(verifyExportConfig(b({ id: undefined }))).toBe(false)
    });

    test("build.id non string: number", () => {
        expect(verifyExportConfig(b({ id: 1 }))).toBe(false)
    });

    test("build.id non string: object", () => {
        expect(verifyExportConfig(b({ id: {} }))).toBe(false)
    });

    test("build.id non string: array", () => {
        expect(verifyExportConfig(b({ id: [] }))).toBe(false)
    });

    test("build.id empty string", () => {
        expect(verifyExportConfig(b({ id: '' }))).toBe(false)
    });

    test("build.id white space only", () => {
        expect(verifyExportConfig(b({ id: '  \t' }))).toBe(false)
    });

    test("build.id multiple periods", () => {
        expect(verifyExportConfig(b({ id: 'developer.Sam.ple_ID' }))).toBe(false)
    });

    test("build.id no periods", () => {
        expect(verifyExportConfig(b({ id: 'developer_Sample_ID' }))).toBe(false)
    });

    test("build.id one period", () => {
        expect(verifyExportConfig(b({ id: 'developer.Sample_ID' }))).toBe(true)
    });

    test("build.id special characters", () => {
        expect(verifyExportConfig(b({ id: 'developer.Sample_ID!' }))).toBe(false)
    });

    test("build.id white spaces", () => {
        expect(verifyExportConfig(b({ id: 'developer.Sample_ID! ' }))).toBe(false)
    });
}

function testBuildProcess() {
    const b = (params) => { return { ...validObj, build: { ...validObj.build, ...params } } }

    test("build.process valid", () => {
        expect(verifyExportConfig(b({ process: "./process.main.js" }))).toBe(true)
    });

    test("build.process undefined", () => {
        expect(verifyExportConfig(b({ process: undefined }))).toBe(false)
    });

    test("build.process non string: number", () => {
        expect(verifyExportConfig(b({ process: 1 }))).toBe(false)
    });

    test("build.process non string: object", () => {
        expect(verifyExportConfig(b({ process: {} }))).toBe(false)
    });

    test("build.process non string: array", () => {
        expect(verifyExportConfig(b({ process: [] }))).toBe(false)
    });

    test("build.process empty string", () => {
        expect(verifyExportConfig(b({ process: '' }))).toBe(false)
    });

    test("build.process white space only", () => {
        expect(verifyExportConfig(b({ process: '  \t' }))).toBe(false)
    });

    test("build.process file extension: ts", () => {
        expect(verifyExportConfig(b({ process: './process/main.ts' }))).toBe(false)
    });

    test("build.process file extension: none", () => {
        expect(verifyExportConfig(b({ process: './process/main' }))).toBe(false)
    });
}

function testBuildReplace() {
    const b = (params) => { return { ...validObj, build: { ...validObj.build, ...params } } }

    test("build.process undefined", () => {
        expect(verifyExportConfig(b({ replace: undefined }))).toBe(true)
    });

    test("build.process empty array", () => {
        expect(verifyExportConfig(b({ replace: [] }))).toBe(true)
    });

    test("build.process with non array: number", () => {
        expect(verifyExportConfig(b({ replace: 1 }))).toBe(false)
    });

    test("build.process with non array: object", () => {
        expect(verifyExportConfig(b({ replace: {} }))).toBe(false)
    });

    test("build.process array with non object", () => {
        expect(verifyExportConfig(b({ replace: [1] }))).toBe(false)
    });

    test("build.process array with one valid object", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_ID}",
                    to: '%id%',
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(true)
    });

    test("build.process array with multiple valid objects", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_ID}",
                    to: "%id%",
                    at: ["./process/main.ts"]
                },
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: "%name%",
                    at: ["./process/main.ts", "./module-info.json"]
                }
            ]
        }))).toBe(true)
    });




    test("build.process array with one invalid: from - undefined", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: undefined,
                    to: "%id%",
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one invalid: from - non string", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: 1,
                    to: "%id%",
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one invalid: from - empty string", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: '',
                    to: "%id%",
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(false)
    });






    test("build.process array with one invalid: to - undefined", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: undefined,
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one invalid: to - non string", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: {},
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one invalid: to - valid build param", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: '%id%',
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(true)
    });

    test("build.process array with one invalid: to - invalid build param", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: '%abc%',
                    at: ["./process/main.ts"]
                }
            ]
        }))).toBe(false)
    });




    test("build.process array with one invalid: at - undefined", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: "%id%",
                    at: undefined
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one invalid: at - non array", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: "%id%",
                    at: "./path"
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one invalid: at - empty array", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: "%id%",
                    at: []
                }
            ]
        }))).toBe(true)
    });

    test("build.process array with one invalid: at - array with non string", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: "%id%",
                    at: [1]
                }
            ]
        }))).toBe(false)
    });

    test("build.process array with one valid: at - array with string", () => {
        expect(verifyExportConfig(b({
            replace: [
                {
                    from: "{EXPORTED_MODULE_NAME}",
                    to: "%id%",
                    at: ["./path"]
                }
            ]
        }))).toBe(true)
    });
}



runTests()


