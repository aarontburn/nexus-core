/* 
Rule Set:

file must be an object

excluded can be omitted if no files are excluded
    excluded must be a string[]
    if empty, interpret as []

included can be omitted if no files are included
    included must be a string[]
    if empty, interpret as []

build CANNOT be missing
build.name CANNOT be missing
    build.name must be a string
    build.name cannot be only whitespace or be empty

build.id CANNOT be missing
    build.id must be a string
    build.id cannot contain whitespace or be empty
    build.id should only have 1 "." splitting the developer name and the name of the module
    build.id cannot contain any special characters besides underscores and the singular "."

build.process CANNOT be missing
    build.process must be a string
    build.process cannot be whitespace or be empty
    build.process needs to end in .js

build.replace can be omitted if nothing needs to be replaced.
    build.replace must be an array of objects
    foreach in build.replace
        build.replace.[from] cannot be missing
            build.replace.[from] must be a string
            build.replace.[from] must not be empty

        build.replace.[to] cannot be missing
            build.replace.[to] must be a string
            build.replace.[to] CAN be an empty string
            if build.replace.[to] is surrounded by %, take property from build object.

        build.replace.[at] cannot be missing
            build.replace.[at] must be a string[] or an empty array.
*/

const verifyExportConfig = (exportConfig) => {
    if (exportConfig["excluded"] !== undefined) {
        if (!doesArrayOnlyContainType(exportConfig["excluded"], "string")) {
            console.error(`export-config.excluded contains invalid data types: ` + exportConfig["excluded"])
            return false;
        }
    } else {
        exportConfig["excluded"] = [];
    }

    if (exportConfig["included"] !== undefined) {
        if (!doesArrayOnlyContainType(exportConfig["included"], "string")) {
            console.error(`export-config.included contains invalid data types: ` + exportConfig["included"])
            return false;
        }
    } else {
        exportConfig["included"] = [];
    }

    if (exportConfig["build"] === undefined) {
        console.error(`export-config.build cannot be undefined.`)
        return false;
    }

    const build = exportConfig["build"];
    if (build["name"] === undefined) {
        console.error(`export-config.build.name cannot be undefined.`)
        return false;
    } else {
        if (typeof build["name"] !== "string") {
            console.error(`export-config.build.name cannot be a non-string.`)
            return false;
        } else {
            if (build["name"].trim() === '') {
                console.error(`export-config.build.name cannot contain only whitespace.`);
                return false;
            }
        }
    }


    if (build["id"] === undefined) {
        console.error(`export-config.build.id cannot be undefined.`)
        return false;
    } else {
        if (typeof build["id"] !== "string") {
            console.error(`export-config.build.id cannot be a non-string.`)
            return false;
        } else {
            if (/\s/g.test(build["id"])) {
                console.error(`export-config.build.id cannot contain white space.`)
                return false;
            }

            const periodCount = build["id"].split('').reduce((count, char) => char === '.' ? count + 1 : count, 0);
            if (periodCount > 1) {
                console.error(`export-config.build.id cannot contain more than one period ('.').`);
                return false;
            } else if (periodCount === 0) {
                console.error(`export-config.build.id must contain one period ('.')`);
                return false;
            }

            const validChars = "abcdefghijklmnopqrstuvwxyz_.";
            for (const char of build["id"]) {
                if (!validChars.includes(char.toLowerCase())) {
                    console.error(`export-config.build.id cannot contain invalid character: ` + char);
                    return false;
                }
            }

        }
    }


    if (build["process"] === undefined) {
        console.error(`export-config.build.process cannot be undefined.`)
        return false;
    } else {
        if (typeof build["process"] !== "string") {
            console.error(`export-config.build.process is a non-string.`)
            return false;
        } else {
            if (build["process"].trim() === '') {
                console.error(`export-config.build.process cannot contain only whitespace.`);
                return false;
            }

            if (build["process"].split(".").at(-1) !== "js") {
                console.error(`export-config.build.process must be a '.js' file`);
                return false;
            }
        }
    }


    if (build["replace"] === undefined) {
        build["replace"] = [];
    } else {
        if (!doesArrayOnlyContainType(build["replace"], "object")) {
            console.error(`export-config.build.replace can only contain objects.`);
            return false;
        }

        for (let i = 0; i < build['replace'].length; i++) {
            const replacementObj = build['replace'][i];

            if (replacementObj["from"] === undefined) {
                console.error(`export-config.build.replace[${i}].from cannot be undefined.`);
                return false;
            } else {
                if (typeof replacementObj["from"] !== "string") {
                    console.error(`export-config.build.replace[${i}].from must be a string.`);
                    return false;
                }

                if (replacementObj["from"] === '') {
                    console.error(`export-config.build.replace[${i}].from cannot be an empty string.`);
                    return false;
                }

            }

            if (replacementObj["to"] === undefined) {
                console.error(`export-config.build.replace[${i}].to cannot be undefined.`);
                return false;
            } else {
                if (typeof replacementObj["to"] !== "string") {
                    console.error(`export-config.build.replace[${i}].to must be a string.`);
                    return false;
                }

                if (replacementObj["to"][0] === "%" && replacementObj["to"].at(-1) === "%") {
                    const property = replacementObj["to"].slice(1, -1);
                    if (build[property] === undefined) {
                        console.error(`export-config.build.replace[${i}].to must be a valid build property if surrounded by parenthesis.`);
                        return false;
                    }
                }

            }

            if (replacementObj["at"] === undefined) {
                console.error(`export-config.build.replace[${i}].at cannot be undefined.`);
                return false;
            } else {
                if (!doesArrayOnlyContainType(replacementObj["at"], "string")) {
                    console.error(`export-config.build.replace[${i}].at must only contain strings.`);
                    return false;
                }
            }
        }
    }
    return true;
}

const doesArrayOnlyContainType = (array, type) => {
    if (!Array.isArray(array)) {
        return false;
    }

    for (const element of array) {
        if (typeof element !== type) {
            return false;
        }
    }
    return true;
}

module.exports = {
    verifyExportConfig
}