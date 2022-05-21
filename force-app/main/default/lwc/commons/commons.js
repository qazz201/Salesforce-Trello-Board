export function uniqueId() {
    let array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    let str = '';
    for (let i = 0; i < array.length; i++) {
        str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
    }
    return str;
}

export function isEmpty(value) {
    if (value === undefined || value === null) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    } else if (typeof value === 'object') {
        return Object.keys(value).length === 0 && value.constructor === Object;
    } else if (value === 0) {
        return false;
    } else if (isString(value)) {
        return !value.trim();
    } else {
        return !Boolean(value);
    }
}

export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export function isNotEmpty(obj) {
    return !isEmpty(obj);
}