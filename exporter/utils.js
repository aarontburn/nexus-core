export const tryOrUndefined = (func) => {
    try {
        return func();
    } catch (e) {
        return undefined;
    }
}


export const missingObjectKeys = (obj, keys) => {
    return Object.keys(obj).filter(k => !keys.includes(k));
} 