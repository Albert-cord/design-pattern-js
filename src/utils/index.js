export function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function isType(obj, type) {
    let realType = typeof type;
    return Object.prototype.toString.call(obj) === `[object ${realType === 'string' ? escapeStrToType(type) : realType}]`;
}


function escapeStrToType(str) {
    if(str.length <= 2) return 'String';
    return str.substring(0, 1).toUpperCase().concat(str.substring(1).toLowerCase());
}

class DesignPatternError extends Error {
    constructor(message, type) {
        super(message);
        this.type = type;
    }

    toString() {
        return `type: ${this.type}; message: ${this.message}`;
    }
}

export function throwDesignPatternError(message, type) {
    return new DesignPatternError(message, type);
}

export function designPatternConsole(...args) {
    if(process.env.NODE_ENV === 'development') {
        if(args.length > 1 && args[0] in console) {
            console[args[0]](...args.slice(1));
        } else {
            console.log(...args);
        }
    } else {

    }
} 