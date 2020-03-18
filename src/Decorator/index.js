
// decorator the same as wrapper
// the same as aop
// cannot assure object's all functions

// can change args or compare beforeFn, afterFn and selfFn
Function.prototype.beforeFn = function(beforeFn) {
    let selfFn = this;
    return function(...args) {
        beforeFn.apply(this, args);
        return selfFn.apply(this, args);
    }
}

Function.prototype.afterFn = function (afterFn) {
    let selfFn = this;
    return function (...args) {
        let ret = selfFn.apply(this, args);
        afterFn.apply(this, args);
        return ret;
    }
}

// but how to operation new action ?
// fn's static method cannot to invoke;

export const beforeFunction = function (beforeFn, fn, compareFn) {
    return function (...args) {
        if (typeof compareFn === 'function' && beforeFn.apply(this, args) !== compareFn.apply(this, args))
            return;
        if (typeof compareFn !== 'function')
            beforeFn.apply(this, args);
        return fn.apply(this, args);
    }
}

export const afterFunction = function (afterFn, fn, compareFn) {
    return function (...args) {
        let ret = fn.apply(this, args);
        if (typeof compareFn === 'function' && ret !== compareFn.apply(this, args))
            return;
        afterFn.apply(this, args);
        return ret;
    }
}