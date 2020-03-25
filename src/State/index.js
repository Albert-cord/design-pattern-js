
import {hasOwnProperty, isType, throwDesignPatternError, designPatternConsole} from '../utils';

// convert state to class
// and setAttribute(setController) to the relevant state
// how ?, use the method to change(set)

const inheritPrototype = function(prevClass, nextClass) {


    // next state add to a static function scope?
    // stateScope.push({idx: stateScope.length, nextState: superClass})
    for(let prop in prevClass) {
        if(hasOwnProperty(prevClass, prop)) {
            nextClass[prop] = prevClass[prop];
        }
    }
    if(prevClass.nextState) {
        nextClass.nextState = prevClass.nextState;
    }
    nextClass.prototype = Object.create(prevClass.prototype);
    nextClass.prototype.constructor = nextClass;
    
}

const beforeFunction = function (superClass, subClass) {
    let func = function (...args) {
        let ret = superClass.apply(this, args);
        inheritPrototype(subClass, superClass);
        // inheritPrototype(superClass, subClass);
        // should return superClass or subClass?
        // return subClass.apply(this, args);
        subClass.apply(this, args);
        return ret;
    }
    inheritPrototype(subClass, func);
    designPatternConsole(subClass.nextState, func.nextState, superClass.nextState)
    return func;
}

// to do:add array operation function ?
export default class State {
    constructor({fns = [], keyMethods = [], initialState, initialStateIndex}) {
        // fns set to a arrayObject?
        // fns -> classes -> states -> stateHashMap
        /* just as 
            {
                fn: () => {},
                state: stateName
            }

        */ 

        // if it is array, it is just can be iterator,but sequent;
        // if it is hashMap, it can be used by id/keyName,it will be more free;
        // but how to sequent? set the index key?,so it will be a array
        // 

        // and can combind flyWeight-pattern or object-pool? or no use just to destroy ?
        // 
        this.states = [];
        // fns as function | class array
        // how to set to a hashMap ?
        this.classes = fns.slice(0);
        this.length = this.classes.length;
        this.noop = Object.create(null);
        this.keyMethod = Array.isArray(keyMethods) ? keyMethods : (keyMethods == undefined ? [] : [keyMethods]);
        this.currentState = null;
        this.currentStateIndex = 0;
        this.stateIndexMap = {};
        this.initialState = initialState;
        this.initialStateIndex = initialStateIndex;
        this.initState();

    }

    initState() {
        if(this.classes.length === 0) {
            throw throwDesignPatternError('parameterError: fns cannot without function', 'StateError');
        }
        if(this.length === 0) {
            this.states[0] = this.noop;
            return;
        }
        let self = this;
        // change:
        /*
            this.states[i] = {
                instance: new func(self);
                state: fn.state
            }
        */

        this.classes.forEach((fn, i) => {
            if(isType(fn, 'object')) {
                let func = beforeFunction(function (state) {
                    this.state = state;
                }, fn.fn)
                this.states[i] = {
                    instance: new func(self),
                    state: fn.state,
                    nextState: fn.nextState
                }
                if(fn.state || fn.fn.name) {
                    this.stateIndexMap[fn.state] = {
                        state:this.states[i],
                        index: i
                    }
                }
            } else if(isType(fn, 'function')) {
                let func = beforeFunction(function (state) {
                    this.state = state;
                }, fn)
                this.states[i] = {
                    instance: new func(self),
                    state: fn.state || fn.name,
                    nextState: fn.nextState
                }
                if(fn.state || fn.name) {
                    this.stateIndexMap[fn.state || fn.name] = {
                        state:this.states[i],
                        index: i
                    }
                }
            } else {
                throw throwDesignPatternError('fns cannot without function', 'parameterError');
            }

        });
        let keyMethod = this.keyMethod;

        this.states.forEach(state => {
            let stateInstance = state.instance;
            let self = this;
            // for in is so force!

            if (keyMethod.length === 0) {
                for (let method in stateInstance) {
                    // if no nextState, how to work in state-pattern, just ignore?
                    if (
                        // so get nextState from method's static variable?
                        // never need nexState
                    typeof stateInstance[method] === 'function' /**  && stateInstance[method].nextState */) {
                        designPatternConsole(stateInstance[method], stateInstance[method].nextState)
                        let nextState = stateInstance[method].nextState;
                        stateInstance[method] = beforeFunction(stateInstance[method], function(){
                            let next = self.stateIndexMap[stateInstance[method].nextState];
                            next = next || self.stateIndexMap[state.nextState];
                            designPatternConsole(next, stateInstance[method], stateInstance[method].nextState)
                            if(next) {
                                this.state.setState(next.state);
                                self.currentStateIndex = next.index;
                            }
                            // if no relevant nextState's state
                            else {
                                this.state.setState(self.states[(++self.currentStateIndex) % self.length]);
                            }
                            // this is rigid;
                            // and the skipIndex just as self.stateIndexMap[state[method.nextState]]
                            // self.stateIndexMap is a hashMap to store states by keyName
                            // , how relevant state how to identify? by the config it can be realized by 
                            /*
                                self.stateIndexMap = {}
                                self.states.forEach(obj => {
                                    self.stateIndexMap[obj.state] = obj;
                                })
                            */
                            // or ++self.currentStateIndex?
                        });
                        stateInstance[method].nextState = nextState;
                    }
                }
            } else {
                keyMethod.forEach(method => {
                    if (typeof stateInstance[method] === 'function' /** && stateInstance[method].nextState */) {``
                        stateInstance[method] = beforeFunction(stateInstance[method], function(){

                            let next = self.stateIndexMap[stateInstance[method].nextState];
                            next = next || self.stateIndexMap[state.nextState];
                            if(next) {
                                this.state.setState(next.state);
                                self.currentStateIndex = next.index;
                            } else {
                                this.state.setState(self.states[(++self.currentStateIndex) % self.length]);
                            }

                        })
                    }
                })
            }
            
        });
        // initialState can be seted?
        if(this.initialStateIndex) {
            this.currentStateIndex = (isType(this.initialStateIndex, 'number') && this.initialStateIndex % this.classes.length) || 0;
        } else if(this.initialState) {
            this.currentStateIndex = (isType(this.initialState, 'string') && this.stateIndexMap[this.initialState] && this.stateIndexMap[this.initialState].index) || 0;
        } else {
            this.currentStateIndex = 0;
        }
        this.length = this.classes.length;
        this.setState(this.states[this.currentStateIndex]);
    }

    rebuildState(...fn) {
        this.classes = fn;
        this.initState();
    }


    // use object proxy to change states and stateMap when fns or state change?

    // is necessary to setOrder ?
    // just to change fns and initState repeatly.
    // setStateOrder() {

    // }

    setState(state) {
        // currentState is important.
        // if currentState has't keyMethod
        designPatternConsole(state);
        if(isType(state, 'string')) {
            this.currentState = this.states.find((s => {
                if(s.state === state) return true;
            }));
            this.currentState = this.currentState || state;
        } else {
            this.currentState = state;
        }
    }
}



    
