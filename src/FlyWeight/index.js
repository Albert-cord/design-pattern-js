
import {hasOwnProperty} from '../utils';
import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';

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

    constructor(isChangeObj = false) {
        this.flyWeightDataBase = {};
        this.isChangeObj = isChangeObj;
    }

    add(id, fn, ...args) {
        // or return fn(id, flyWeightDataBase, ...args) ?
        this.flyWeightDataBase[id] = fn.call(null, ...args);
        return cloneDeep(this.flyWeightDataBase[id]);
    }

    setProp(id, prop, value, isMerge = false) {
        this.flyWeightDataBase[id] = this.flyWeightDataBase[id] || {};
        if(!isMerge)
            this.flyWeightDataBase[id][prop] = value;
        else if(this.flyWeightDataBase[id][prop]) {
            extend(this.flyWeightDataBase[id][prop], value);
        } else {
            this.flyWeightDataBase[id][prop] = value;
        }
        return cloneDeep(this.flyWeightDataBase[id]);
    }

    // all externalState is necessary ?
    setExternalState(id, flyWeightObject, isChangeObj = false) {
        
        let flyWeightObjectData = this.flyWeightDataBase[id];
        if(!isChangeObj && !this.isChangeObj) {
            flyWeightObjectData = cloneDeep(this.flyWeightDataBase[id]);
        }
        for (let prop in flyWeightObject) {
            if (hasOwnProperty(flyWeightObject, prop)) {
                flyWeightObjectData[prop] = flyWeightObject[prop];
            }
        }
        if(!isChangeObj && !this.isChangeObj)
            return flyWeightObjectData;
        else
            return cloneDeep(flyWeightObjectData);
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