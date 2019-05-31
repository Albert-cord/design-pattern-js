
// use shared tech to support a lot of fine-grained object;

// flyWeight
// external status(hook) and inner status(select)
const FlyWeightFactory = function(factoryClass) {
    const flyWeightInstances = {};
    return {
        create(...args) {
            let key = args.join('')
            if(flyWeightInstances[key]) {
                return flyWeightInstances[key];
            }
            return new factoryClass(...args);
        }
    }
}

const flyWeightManager = (function() {
    const flyWeightDataBase = {};
    return {
        // return what ?
        add(id, fn, ...args) {
            // or return fn(id, flyWeightDataBase, ...args) ?
            flyWeightDataBase[id] = fn(...args);
        },
        // all externalState is necessary ?
        setExternalState(id, flyWeightObject) {
            let flyWeightObjectData = flyWeightDataBase[id];
            for (let prop in flyWeightObjectData) {
                if (Object.prototype.toString.call(flyWeightObjectData, prop)) {
                    flyWeightObject[prop] = flyWeightObjectData[prop];
                }
            }
            return flyWeightObject;
        }
    }
})()


// object pool
// Function-orientition;
const objectPoolFactory = function(createFn) {
    
    let objectPool = [];

    return {
        create(...args) {
            if(objectPool.length === 0) {
                // createFn how to apply a context ?
                let ret = createFn(...args);
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