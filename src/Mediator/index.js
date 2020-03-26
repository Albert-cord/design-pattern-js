import {isType, designPatternConsole} from '../utils';
import extend from 'lodash/extend';
// it is usually realized by two condition, 
// first: publishSubscribe, just patch message and pass arguments
// second: mediator, just as publishSubscribe, but can pass itself or something can
// identify itself,eg:id..., by a public interface

// Principle of least knowledge
class MediatorFactory {
    constructor(operations) {
        this.mediatorOperations = {};
        if ( isType(operations, 'object') ) {
            // extend
            // this.mediatorOperations = operations;
            extend(this.mediatorOperations, operations);
        } else {
            if (Array.isArray(operations)) {
                operations.forEach(method => {
                    designPatternConsole(operations, method)
                    if(isType(method, 'object')) {
                        // can put the promise chain
                        this.mediatorOperations[method.name] = method.fn || method.promise;
                    } else {

                        designPatternConsole('error', 'MediatorFactory must pass a object {name, fn} parameter');
                    }
                });
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
            // can use then;
            // 但是这样会不会导致不可知结果？传入一个同步函数结果他是可以先执行的
            // a, b, c, f
            // 其中a是异步， b是同步
            // 这样会导致,b先执行，而不是队列执行
            // 这里还是顺序执行
            return await this.mediatorOperations[message].apply(this, args);
        } else if(isType(msg, 'promise')) {
            return await this.mediatorOperations[message].then(...args);
        }
    }
}
export default MediatorFactory;
