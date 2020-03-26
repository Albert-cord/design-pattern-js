export function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isOneType(obj, type) {
    let realType = typeof type;
    return Object.prototype.toString.call(obj) === `[object ${realType === 'string' ? escapeStrToType(type) : realType}]`;
}

export function isType(obj, type, ...otherType) {
    if(!Array.isArray(otherType) || otherType.length === 0) {
       return isOneType(obj, type); 
    } else {
        return [type, ...otherType].some(t => {
            return isOneType(obj, t);
        })
    }
}


function escapeStrToType(str) {
    if(str.length <= 2) return 'String';
    return str.substring(0, 1).toUpperCase().concat(str.substring(1).toLowerCase());
}

// why?
// class DesignPatternError extends Error {
//     constructor(message, type) {
//         super(message);
//         this.type = type;
//         this.name = type;
//         this.stack = (new Error()).stack;
//     }

//     toString() {
//         return `type: ${this.type}; message: ${this.message}`;
//     }
// }

function DesignPatternError(message, type) {
    this.name = 'DesignPatternError';
    this.message = `${type}::${message}` || 'Default Message';

    this.stack = (new Error()).stack;
  }
DesignPatternError.prototype = Object.create(Error.prototype);
DesignPatternError.prototype.constructor = DesignPatternError;

export function throwDesignPatternError(message, type) {
    return new DesignPatternError(message, type);
}

const productConsolePropertys = ['error'];
export function designPatternConsole(...args) {
    if(console) {
        if(process.env.NODE_ENV === 'development') {
            if(args.length > 1 && args[0] in console) {
                console[args[0]](...args.slice(1));
            } else {
                console.log(...args);
            }
        } else {
            if(args.length > 1 && productConsolePropertys.includes(args[0])) {
                console[args[0]](...args.slice(1));
            }
        }
    }
} 