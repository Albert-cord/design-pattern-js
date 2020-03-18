

// it is usually realized by two condition, 
// first: publishSubscribe, just patch message and pass arguments
// second: mediator, just as publishSubscribe, but can pass itself or something can
// identify itself,eg:id..., by a public interface

// Principle of least knowledge
const mediatorFactory = function(operations) {
    let mediatorOperations = {};
    if (Object.prototype.toString.call(operations) === '[object Object]') {
        mediatorOperations = operations;
    } else {
        if (Array.isArray(operations)) {
            operations.forEach(method => {
                console.log(operations, method)
                if(typeof method === 'function') {
                    mediatorOperations[method.name] = method;
                }
            })
        }
    }

    return {
        receiverMessage(message, ...args) {
            if (typeof mediatorOperations[message] === 'function') {
                mediatorOperations[message].apply(this, args);
            }
        },
        mediatorOperations
    }
}
export default mediatorFactory;
