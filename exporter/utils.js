const tryOrUndefined = (func) => {
    try {
        return func();
    } catch (e) {
        return undefined;
    }
}

const tryOrUndefinedAsync = async (func) => {
    try {
        return await func();
    } catch (e) {
        return undefined;
    }
}


const missingObjectKeys = (obj, keys) => {
    return keys.filter(k => !Object.keys(obj).includes(k))
} 

const defaultDevJSON = {
    last_exported_id: null
}

module.exports = {
    tryOrUndefined,
    tryOrUndefinedAsync,
    missingObjectKeys,
    defaultDevJSON
}