
const uncurrrying = function(fn) {
    return function(context, ...args) {
        return fn.call(context, ...args);
    }
}
export default uncurrrying;