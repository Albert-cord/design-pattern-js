// use js-lru will be great without stackoverflow;
// var cache = {};

// function closureCache() {
//     //has a key
//     var key = Array.prototype.join.call(arguments, '');
//     if(cache[key]) {
//         return cache[key];
//     }
//     //otherWise deal with data;
// }
const closureCache = function (fn) {
    // use js-lru will be great without stackoverflow;
        let cache = {};
        return function () {
            //has a key
            let key = Array.prototype.join.call(arguments, '');
            if (cache[key]) {
                return cache[key];
            }
            //otherWise deal with data;
            return cache[key] = fn.apply(this, arguments);
        }
};

export default closureCache;

var lastLifeCyclePost = (function() {
    var args = [];
    return function(src, callBack) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            args.push(src);
            img.src = src;
            img.onload = function () {
                var ret = typeof (callBack) === 'function' && callBack();
                resolve(ret);
            }
        })
    }
}())