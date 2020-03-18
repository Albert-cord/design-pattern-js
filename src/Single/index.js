

// 惰性单例
var getSingle = function( fn ){
    var result;
    return function(){
    return result || ( result = fn .apply(this, arguments ) );
    }
};

export default class Single {
    constructor(fn) {
        this.fn = fn;
        this.instance = null;
    }

    getInstance(...args) {
        return this.instance || (this.instance = this.fn.apply(this, args));
    }

}