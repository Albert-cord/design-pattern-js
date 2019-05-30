
// use shared tech to support a lot of fine-grained object;

// to do:
// flyWeight
//




// object pool
// Function-orientition;
const objectPoolFactory = function(createFn) {
    
    let objectPool = [];

    return {
        create(...args) {
            if(objectPool.length === 0) {
                let ret = createFn.apply(this, args);
                objectPool.push(ret);
                return ret;
            } else {
                return objectPool.shift();
            }
        },
        recover(obj) {
            objectPool.push(obj);
        }
    }
}