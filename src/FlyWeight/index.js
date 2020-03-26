
import {hasOwnProperty} from '../utils';
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

class FlyWeightManager {

    constructor() {
        this.flyWeightDataBase = {};
    }

    add(id, fn, ...args) {
        // or return fn(id, flyWeightDataBase, ...args) ?
        this.flyWeightDataBase[id] = fn.call(null, ...args);
        return this.flyWeightDataBase[id];
    }
    // all externalState is necessary ?
    setExternalState(id, flyWeightObject) {
        let flyWeightObjectData = this.flyWeightDataBase[id];
        for (let prop in flyWeightObject) {
            if (hasOwnProperty(flyWeightObject, prop)) {
                flyWeightObjectData[prop] = flyWeightObject[prop];
            }
        }
        return flyWeightObjectData;
    }
}

export default FlyWeightManager;



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