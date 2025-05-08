


const doesArrayOnlyContainType = (array, type) => {
    if (!Array.isArray(array)) {
        return false;
    }

    for (const element of array) {
        
        if (type === 'object' && Array.isArray(element)) {
            return false
        }

        if (typeof element !== type) {
            return false;
        }
    }
    return true;
}

const isValidReplace = (exportConfig, replaceArray) => {
    if (replaceArray !== undefined) {
        if (!doesArrayOnlyContainType(replaceArray, "object")) {
            return new Error(`export-config.build.replace can only contain objects.`);
        }

        for (let i = 0; i < replaceArray.length; i++) {
            const replacementObj = replaceArray[i];

            if (replacementObj["from"] === undefined) {
                return new Error(`export-config.build.replace[${i}].from must cannot be undefined`);
            } else {
                if (typeof replacementObj["from"] !== "string") {
                    return new Error(`export-config.build.replace[${i}].from must be a string.`);
                }

                if (replacementObj["from"] === '') {
                    return new Error(`export-config.build.replace[${i}].from cannot be an empty string.`);
                }

            }

            if (replacementObj["to"] === undefined) {
                return new Error(`export-config.build.replace[${i}].to cannot be undefined.`);
            } else {
                if (typeof replacementObj["to"] !== "string") {
                    return new Error(`export-config.build.replace[${i}].to must be a string.`);
                }

                if (replacementObj["to"][0] === "%" && replacementObj["to"].at(-1) === "%") {
                    const property = replacementObj["to"].slice(1, -1);
                    if (exportConfig[property] === undefined) {
                        return new Error(`export-config.build.replace[${i}].to must be a valid build property if surrounded by %.`);
                    }
                }

            }

            if (replacementObj["at"] === undefined) {
                return new Error(`export-config.build.replace[${i}].at cannot be undefined.`);
            } else {
                if (!doesArrayOnlyContainType(replacementObj["at"], "string")) {
                    return new Error(`export-config.build.replace[${i}].at must only contain strings.`);
                }
            }
        }
    }
    return true;
}



const isValidModuleID = (moduleID) => {
    if (moduleID === undefined) {
        return new Error(`export-config.build.id cannot be undefined.`);
    } else {
        if (typeof moduleID !== "string") {
            return new Error(`export-config.build.id cannot be a non-string.`);
        } else {
            if (/\s/g.test(moduleID)) {
                return new Error(`export-config.build.id cannot contain white space.`);
            }

            const periodCount = moduleID.split('').reduce((count, char) => char === '.' ? count + 1 : count, 0);
            if (periodCount > 1) {
                return new Error(`export-config.build.id cannot contain more than one period ('.').`);
            } else if (periodCount === 0) {
                return new Error(`export-config.build.id must contain one period ('.')`);
            }

            const validChars = "abcdefghijklmnopqrstuvwxyz_.";
            for (const char of moduleID) {
                if (!validChars.includes(char.toLowerCase())) {
                    return new Error(`export-config.build.id cannot contain invalid character: ` + char);
                }
            }

        }
    }
    return true;
}

const validators = {
    NON_EMPTY_STRING: (s) => typeof s === "string" && s.trim().length > 0,
    SINGLE_TYPE_ARRAY: (array, type) => doesArrayOnlyContainType(array, type),
    VALID_ID: (s) => !(isValidModuleID(s) instanceof Error),
    VALID_VERSION: (s) => /^\d+\.\d+\.\d+$/.test(s),
    VALID_REPLACE: (exportConfig, o) => !(isValidReplace(exportConfig, o) instanceof Error),
    OPTIONAL_SINGLE_TYPE_ARRAY: (array, type) => array === undefined || doesArrayOnlyContainType(array, type),
    TYPE_NUMBER: (n) => typeof n === "number",
    TYPE_OBJECT: (o) => typeof o === 'object' && !Array.isArray(o) && o !== null,
}

module.exports = {
    validators
}