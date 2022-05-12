export function cloneObject(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
        let cloneArray = [];
        for (let i=0; i<source.length; i++) {
            cloneArray[i] = cloneObject(source[i]);
        }
        return cloneArray;
    } else if (typeof(source)=="object") {
        let cloneObj = {};
        for (let prop in source) {
            if (source.hasOwnProperty(prop)) {
                cloneObj[prop] = cloneObject(source[prop]);
            }
        }
        return cloneObj;
    } else {
        return source;
    }
}