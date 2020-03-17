
import {hasOwnProperty} from '../utils';

// convert state to class
// and setAttribute(setController) to the relevant state
// how ?, use the method to change(set)

const inheritPrototype = function(superClass, subClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    // for(let prop in superClass) {
    //     if(hasOwnProperty(superClass, prop)) {
    //         subClass[prop] = superClass[prop];
    //     }
    // }
}

const beforeFunction = function (superClass, subClass, compareFn) {
    let func = function (...args) {
        if (typeof compareFn === 'function' && superClass.apply(this, args) !== compareFn.apply(this, args))
            return;
        if (typeof compareFn !== 'function')
            superClass.apply(this, args);
        inheritPrototype(subClass, superClass)

        return subClass.apply(this, args);
    }
    inheritPrototype(subClass, func);
    return func;
}

// to do:add array operation function ?
class State {
    constructor({fns = [], keyMethod = []}) {
        // if it is array, it is just can be iterator,but sequent;
        // if it is hashMap, it can be used by id/keyName,it will be more free;
        // and can combind flyWeight-pattern or object-pool? or no use just to destroy ?
        this.states = [];
        // fns as function | class array
        this.classes = fns.slice(0);
        this.length = this.classes.length;
        this.noop = Object.create(null);
        this.keyMethod = keyMethod;
        this.currentState = null;
        this.currentStateIndex = 0;

        this.initState();

    }

    initState() {
        if(this.length === 0) {
            this.states[0] = this.noop;
            return;
        }
        let self = this;
        this.classes.forEach((fn, i) => {
            let func = beforeFunction(function (state) {
                this.state = state;
            }, fn)

            this.states[i] = new func(self);
            // this.states[i] = new beforeFunction(function (state) {
            //     this.state = state;
            // }, fn)(self);
        });
        let keyMethod = this.keyMethod;

        this.states.forEach(state => {
            let self = this;
            // for in is so force!

            if (keyMethod.length === 0) {
                for (let method in state) {
                    if (
                        // Object.prototype.hasOwnProperty.call(state, method) && 
                    typeof state[method] === 'function') {
                        state[method] = beforeFunction(state[method], function(){
                            // this is rigid;
                            this.state.setState(self.states[(++self.currentStateIndex) % self.length]);
                        })
                    }
                }
            } else {
                keyMethod.forEach(method => {
                    if (typeof state[method] === 'function') {
                        state[method] = beforeFunction(state[method], function(){
                            // this is rigid;
                            this.state.setState(self.states[(++self.currentStateIndex) % self.length]);
                        })
                    }
                })
            }
            
        })
        this.currentStateIndex = 0;
        this.length = this.classes.length;
        this.setState(this.states[this.currentStateIndex]);
    }

    // is necessary to setOrder ?
    // just to change classes and initState repeatly.
    // setStateOrder() {

    // }

    setState(state) {
        // currentState is important.
        // if currentState has't keyMethod
        this.currentState = state;
    }
}


    // use 
    var OffLightState = function () { this.a = 0; return this;};
    OffLightState.prototype.buttonWasPressed = function () {
        console.log('弱光'); // offLightState 对应的行为
    }; 
    var OffLightState1 = function () { this.aa = 1; return this;};
    OffLightState1.prototype.buttonWasPressed = function () {
        console.log('弱光1'); // offLightState 对应的行为
    };
    var OffLightState2 = function () { this.aaa = 2; return this;};
    OffLightState2.prototype.buttonWasPressed = function () {
        console.log('弱光2'); // offLightState 对应的行为
    }; 
    var OffLightState3 = function () { this.aaaa = 3;return this;};
    OffLightState3.prototype.buttonWasPressed = function () {
        console.log('弱光3'); // offLightState 对应的行为
    };

    var classes = [OffLightState, OffLightState1, OffLightState2, OffLightState3];

    var state = new State({fns: classes});
