

// 惰性单例
var getSingle = function( fn ){
    var result;
    return function(){
    return result || ( result = fn .apply(this, arguments ) );
    }
};

// need cache?
// let cacheObj = {};
export default class Single {
    constructor(fn) {
        this.fn = fn;
        this.instance = null;
    }
    // if args are not match by pre setter ?
    getInstance(...args) {
        // need cache?
        // let cache;
        return this.instance || (this.instance = this.fn.apply(null, args));
    }

}

// need cache ?
// Single.clearCache = function() {
//     cacheObj = {};
// }