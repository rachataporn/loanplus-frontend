export function isNotEmpty(val) {
    if (val !== undefined && val !== null) {
        if (typeof val === 'string' && val.trim() == '') {
            return false;
        } else if (typeof val === 'object') {
            for (var prop in val) {
                if (val.hasOwnProperty(prop)) {
                    return true;
                }
            }
            return JSON.stringify(val) !== JSON.stringify({});
        } else if (typeof val === 'boolean') {
            return val;
        } else {
            return true;
        }
    }
    return false;
}

export function isEmpty(val) {
    return !isNotEmpty(val);
}