import {isType, designPatternConsole} from '../utils';

// it is usually realized by two condition, 
// first: publishSubscribe, just patch message and pass arguments
// second: mediator, just as publishSubscribe, but can pass itself or something can
// identify itself,eg:id..., by a public interface

// Principle of least knowledge
class MediatorFactory {
    constructor(operations) {
        this.mediatorOperations = {};
        if ( isType(operations, 'object') ) {
            this.mediatorOperations = operations;
        } else {
            if (Array.isArray(operations)) {
                operations.forEach(method => {
                    designPatternConsole(operations, method)
                    if(typeof method === 'function') {
                        this.mediatorOperations[method.name] = method;
                    }
                })
            }
        }
    }
    // async and sync API ...
    // should distinct?
    receiverMessage(message, ...args) {
        if (typeof this.mediatorOperations[message] === 'function') {
            return this.mediatorOperations[message].apply(this, args);
        }
    }
    async receiverMessageAsync(message, ...args) {
        let msg = this.mediatorOperations[message];
        if (isType(msg, 'function')) {
            return await this.mediatorOperations[message].apply(this, args);
        } else if(isType(msg, 'promise')) {
            return await this.mediatorOperations[message].then(...args);
        }
    }
}
export default MediatorFactory;
