import {isType, designPatternConsole} from '../utils';

// it is usually realized by two condition, 
// first: publishSubscribe, just patch message and pass arguments
// second: mediator, just as publishSubscribe, but can pass itself or something can
// identify itself,eg:id..., by a public interface

// Principle of least knowledge
const mediatorFactory = function(operations) {
    let mediatorOperations = {};
    if ( isType(operations, 'object') ) {
        mediatorOperations = operations;
    } else {
        if (Array.isArray(operations)) {
            operations.forEach(method => {
                designPatternConsole(operations, method)
                if(typeof method === 'function') {
                    mediatorOperations[method.name] = method;
                }
            })
        }
    }

    return {
        // async and sync API ...
        // should distinct?
        async receiverMessage(message, ...args) {
            if (typeof mediatorOperations[message] === 'function') {
                let ret = mediatorOperations[message].apply(this, args);
                if(!isType(ret, 'promise')) {
                    return ret;
                } else {
                    return await ret;
                }
            }
        },
        mediatorOperations
    }
}
export default mediatorFactory;
