export const tryOrUndefined = (func) => {
    try {
        return func();
    } catch (e) {
        return undefined;
    }
}

export const tryOrUndefinedAsync = async (func) => {
    try {
        return await func();
    } catch (e) {
        return undefined;
    }
}


export const missingObjectKeys = (obj, keys) => {
    return keys.filter(k => !Object.keys(obj).includes(k))
} 

export const defaultDevJSON = {
    last_exported_id: null
}