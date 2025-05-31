//@ts-check




const { validators } = require('./validators')

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


const rootKeys = {
    name: validators.NON_EMPTY_STRING,
    id: validators.VALID_ID,
    version: validators.VALID_VERSION,
    build: validators.TYPE_OBJECT,
}

const requiredBuildKeys = {
    process: (s) => validators.NON_EMPTY_STRING(s) && s.endsWith('.js'),
    replace: validators.VALID_REPLACE,
    'build-version': validators.TYPE_NUMBER,
    included: validators.OPTIONAL_SINGLE_TYPE_ARRAY,
    excluded: validators.OPTIONAL_SINGLE_TYPE_ARRAY
}

const verifyModuleInfo = (exportConfig, verbose = false) => {
    for (const [key, validatorFunction] of Object.entries(rootKeys)) {
        const params = exportConfig[key]
        if (verbose) console.info(`Validating ${key} with param ${typeof params === "object" ? JSON.stringify(params) : params}`)
    
        if (!validatorFunction(exportConfig[key])) {
            return false;
        }
    }

    for (const [key, validatorFunction] of Object.entries(requiredBuildKeys)) {
        const params = exportConfig["build"][key]
        if (verbose) console.info(`Validating ${key} with param ${typeof params === "object" ? JSON.stringify(params) : params}`)

        if (key === "replace") {
            if (!validatorFunction(exportConfig, exportConfig["build"][key])) {
                return false;
            }
        } else if (key === "included" || key === "excluded") {
            if (!validatorFunction(exportConfig["build"][key], 'string')) {
                return false;
            }
        } else {
            if (!validatorFunction(exportConfig["build"][key])) {
                return false;
            }
        }
    }
    return true;
}


module.exports = {
    verifyModuleInfo
}