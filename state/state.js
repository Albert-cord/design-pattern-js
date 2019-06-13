

// convert state to class
// and setAttribute(setController) to the relevant state
// how ?, use the method to change(set)

const inheritPrototype = function(prevClass, nextClass) {


    // next state add to a static function scope?
    // stateScope.push({idx: stateScope.length, nextState: superClass})
    if(prevClass.nextState) {
        nextClass.nextState = prevClass.nextState;
    }
    nextClass.prototype = Object.create(prevClass.prototype);
    nextClass.prototype.constructor = nextClass;
}

const beforeFunction = function (superClass, subClass) {
    let func = function (...args) {
        superClass.apply(this, args);
        inheritPrototype(subClass, superClass);
        // inheritPrototype(superClass, subClass);
        return subClass.apply(this, args);
    }
    inheritPrototype(subClass, func);
    // console.log(subClass.nextState, func.nextState, superClass.nextState)
    return func;
}

// to do:add array operation function ?
class State {
    constructor({fns = [], keyMethod = []}) {
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
        this.keyMethod = keyMethod;
        this.currentState = null;
        this.currentStateIndex = 0;
        this.stateIndexMap = {};

        this.initState();

    }

    initState() {
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
            let func = beforeFunction(function (state) {
                this.state = state;
            }, fn.fn)
            this.states[i] = {
                instance: new func(self),
                state: fn.state
            }
            if(fn.state) {
                this.stateIndexMap[fn.state] = {
                    state:this.states[i],
                    index: i
                }
            }
            // this.states[i] = new func(self);
            // this.states[i] = new beforeFunction(function (state) {
            //     this.state = state;
            // }, fn)(self);
        });
        let keyMethod = this.keyMethod;

        this.states.forEach(state => {
            state = state.instance
            let self = this;
            // for in is so force!

            if (keyMethod.length === 0) {
                for (let method in state) {
                    // if no nextState, how to work in state-pattern, just ignore?
                    if (
                        // so get nextState from method's static variable?
                    typeof state[method] === 'function' && state[method].nextState) {
                        // console.log(state[method], state[method].nextState)
                        let nextState = state[method].nextState
                        state[method] = beforeFunction(state[method], function(){
                            let next = self.stateIndexMap[state[method].nextState];
                            console.log(next, state[method], state[method].nextState)
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
                        })
                        state[method].nextState = nextState;
                    }
                }
            } else {
                keyMethod.forEach(method => {
                    if (typeof state[method] === 'function' && state[method].nextState) {
                        state[method] = beforeFunction(state[method], function(){

                            let next = self.stateIndexMap[state[method].nextState];
                            if(next) {
                                this.state.setState(next[state]);
                                self.currentStateIndex = next.index;
                            } else {
                                this.state.setState(self.states[(++self.currentStateIndex) % self.length]);
                            }

                        })
                    }
                })
            }
            
        })
        this.currentStateIndex = 0;
        this.length = this.classes.length;
        this.setState(this.states[this.currentStateIndex]);
    }


    // use object proxy to change states and stateMap when fns or state change?

    // is necessary to setOrder ?
    // just to change fns and initState repeatly.
    // setStateOrder() {

    // }

    setState(state) {
        // currentState is important.
        // if currentState has't keyMethod
        console.log(state)
        this.currentState = state;
    }
}


// use 
var OffLightState = function () { this.a = 0; return this;};
OffLightState.prototype.buttonWasPressed = function () {
    console.log('弱光'); // offLightState 对应的行为
};
OffLightState.prototype.buttonWasPressed.nextState = 'ruoguang4'

var OffLightState1 = function () { this.aa = 1; return this;};
OffLightState1.prototype.buttonWasPressed = function () {
    console.log('弱光1'); // offLightState 对应的行为
};
OffLightState1.prototype.buttonWasPressed.nextState = 'ruoguang1';
var OffLightState2 = function () { this.aaa = 2; return this;};
OffLightState2.prototype.buttonWasPressed = function () {
    console.log('弱光2'); // offLightState 对应的行为
};
OffLightState2.prototype.buttonWasPressed.nextState = 'ruoguang3';
var OffLightState3 = function () { this.aaaa = 3;return this;};
OffLightState3.prototype.buttonWasPressed = function () {
    console.log('弱光3'); // offLightState 对应的行为
};
OffLightState3.prototype.buttonWasPressed.nextState = 'ruoguang2';

var classes = [{
    fn: OffLightState,
    state: 'ruoguang1'
},{
    fn: OffLightState1,
    state: 'ruoguang2'
},{
    fn: OffLightState2,
    state: 'ruoguang3'
},{
    fn: OffLightState3,
    state: 'ruoguang4'
}];

var state = new State({fns: classes});
state.currentState.instance.buttonWasPressed()
    
