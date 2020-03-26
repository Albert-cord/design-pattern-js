
const currrying = function(fn, pattern = '+', context = null) {
    let cacheArgs = [];
    if(pattern === '+') {
        return function(...args) {
            if(args.length === 0) {
                let res;
                for (const iterator of args) {
                    // if+
                    res += fn(iterator);
                    // if-
                    res -= fn(iterator);
                    // ()
                    res = fn(iterator());
                    // or initial res = fn(...args)?
                    res = iterator(res, ...args);
                    // or in the end res = fn(res, ...args);
                }
            } else {
                cacheArgs.push(...args);
            }
        }
    }
    return function(context, ...args) {
        return fn.call(context, ...args);
    }
}
export default currrying;

// async function can(f) {
//     let ret = f();
//     if(!Object.prototype.toString.call(ret) === '[object Promise]') {
//         return ret;
//     } else {
//         return await ret;
//     }
// }

// async function forOf(...fns) {
//     for (const iterator of fns) {
//     let ret = iterator();
//     if(!Object.prototype.toString.call(ret) === '[object Promise]') {
//         return ret;
//     } else {
//         return await ret;
//     }
//     }
// }