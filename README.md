# design-pattern-js
to create a useful JavaScript's design pattern library.

## Use:
    npm i design-pattern-js

## Examples
### 责职链模式/DutyChains
```javaScript
// Use:
// new DutyChains(nextKey: String, fn1: {name:String, fn: Function}, fn2, fn3, ...);

// recommend:
// new DutyChains({nextKey: String, [fn1: {name:String, fn: Function}, fn2, fn3, ...]});

let {DutyChains} =  require('design-pattern-js');
var nextKey = 'nextKey';
function fn(f) {
  if(f()) {
    return nextKey;
  } else {
      return 'fn';
  }
};
function otherFn(f, f1) {
  if(f1()) {
    return nextKey;
  } else {
    return 'otherFn';
  }
};
function insertFn(f, f1, f2) {
  if(f2()) {
    return nextKey;
  } else {
    return 'insertFn';
  }
};
function insteadOfFn(f, f1, f2, f3) {
  if(f3()) {
    return nextKey;
  } else {
    return 'insteadOfFn';
  }
};

var fns = [{fn, name: 'fn'}, {fn: otherFn, name: 'otherFn'}];
var dc = new DutyChains({nextKey: nextKey, fns: fns}); // or var dc = new DutyChains(nextKey, ...fns);
// API:start(...args)
dc.start(() => true, () => false, () => false, () => false,); // 'otherFn'
dc.start(() => false, () => true, () => false, () => false,); // 'fn'

// startUseContext API:
// API:startUseContext(context, ...args)
// API:startUseContext({context, args})

// context for DutyChains's fns
dc.startUseContext({context: {not: true, f: false}, args: [() => this.not, () => this.f]}); // 'fn'
// or use 
dc.startUseContext({not: true, f: false}, () => this.not, () => this.f); // 'fn'

// API: insert(num: Number, ...Function)
var dc = new DutyChains(nextKey, ...fns);
dc.insert(0, {fn: insertFn, name: 'insertFn'}) // true
// or insert By String name
// dc.insert('fn', {fn: insertFn, name: 'insertFn'}) // true

// API: toString()
dc.toString() // 'fn->insertFn->otherFn::0->1->2'

// API: instead(num: Number, ...Function)
dc.instead(0, {fn: insteadOfFn, name: 'insteadOfFn'});
// or by String name
// dc.instead('fn', {fn: insteadOfFn, name: 'insteadOfFn'});
dc.toString() // 'insteadOfFn->insertFn->otherFn::0->1->2'

dc.instead(-1);
dc.toString() // 'insteadOfFn->insertFn::0->1'

// API: setNextKey(nextKey: String)
dc.setNextKey('replaceKey');
dc.nextKey // replaceKey

```

### 状态模式/State
```javaScript

let {State} =  require('design-pattern-js');
// Use:
// new State({fns: [{fn: Function, state: String, nextState?:String}], initialStateIndex?: Number || 0, initialState?: String, keyMethods?: [String, ...] || String});
// 如果不限定keyMethods，则所有方法都会被认为是状态函数

let OffLightState = function () { this.a = 0; return this;};
OffLightState.prototype.buttonWasPressed = function () {
    // console.log('弱光'); // offLightState 对应的行为
    return 0;
};
// 可以设置nextState 或者 设置函数的静态属性的nextState，否则顺序执行
// setter a nextState property in the parameters or setter nextState in function's static property, neither of its, function will run in the sequence;
OffLightState.prototype.buttonWasPressed.nextState = 'ruoguang4';
OffLightState.prototype.useElectron = function () {
    return '0 W';
};


let OffLightState1 = function () { this.aa = 1; return this;};
OffLightState1.prototype.buttonWasPressed = function () {
    // console.log('弱光1'); // offLightState 对应的行为
    return 1;
};
// 可以设置nextState 或者 设置函数的静态属性的nextState，否则顺序执行
// setter a nextState property in the parameters or setter nextState in function's static property, neither of its, function will run in the sequence;
OffLightState1.prototype.buttonWasPressed.nextState = 'ruoguang1';
OffLightState1.prototype.useElectron = function () {
    return '1 W';
};

let OffLightState2 = function () { this.aaa = 2; return this;};
OffLightState2.prototype.buttonWasPressed = function () {
    // console.log('弱光2'); // offLightState 对应的行为
    return 2;
};
// 可以设置nextState 或者 设置函数的静态属性的nextState，否则顺序执行
// setter a nextState property in the parameters or setter nextState in function's static property, neither of its, function will run in the sequence;
OffLightState2.prototype.buttonWasPressed.nextState = 'ruoguang3';
OffLightState2.prototype.useElectron = function () {
    return '2 W';
};

let OffLightState3 = function () { this.aaaa = 3;return this;};
OffLightState3.prototype.buttonWasPressed = function () {
    // console.log('弱光3'); // offLightState 对应的行为
    return 3;
};
OffLightState3.prototype.useElectron = function () {
    return '3 W';
};
// 可以设置nextState 或者 设置函数的静态属性的nextState，否则顺序执行
// setter a nextState property in the parameters or setter nextState in function's static property, neither of its, function will run in the sequence;
OffLightState3.prototype.buttonWasPressed.nextState = 'ruoguang2';

let classes = [{
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

let state = new State({fns: classes});

state.currentState.instance.buttonWasPressed() // 0
// or use: state.instance.buttonWasPressed()
state.currentState.instance.buttonWasPressed() // 3
state.currentState.instance.buttonWasPressed() // 1
state.currentState.instance.buttonWasPressed() // 0

let otherClasses = [{
    fn: OffLightState,
    state: 'ruoguang1',
    nextState: 'ruoguang3'
},{
    fn: OffLightState1,
    state: 'ruoguang2',
    nextState: 'ruoguang1'
},{
    fn: OffLightState2,
    state: 'ruoguang3',
    nextState: 'ruoguang4'
},{
    fn: OffLightState3,
    state: 'ruoguang4',
    nextState: 'ruoguang2'
}];
state = new State({fns: otherClasses, initialState: 'ruoguang3', keyMethods: 'useElectron'});
state.currentState.instance.useElectron() // '2 W'
state.currentState.instance.useElectron() // '3 W'
state.currentState.instance.useElectron() // '1 W'
state.currentState.instance.useElectron() // '0 W'
state.currentState.instance.useElectron() // '2 W'

// API setState
state = new State({fns: otherClasses, initialStateIndex: 2, keyMethods: 'useElectron'});
state.currentState.instance.useElectron() // '2 W'
state.setState('ruoguang2');
state.currentState.instance.useElectron() // '1 W'
state.currentState.instance.useElectron() // '0 W'
state.setState('ruoguang2');
state.currentState.instance.useElectron() // '1 W'
state.setState('ruoguang4');
assert.equal(state.currentState.instance.useElectron(), '3 W');
```

### 享元模式/FlyWeight
```javaScript
let {FlyWeightManager} =  require('design-pattern-js');

let flyWeightManager = new FlyWeightManager();
// Use:
// let flyWeightManager = new FlyWeightManager(isChangeObj: Boolean || false);
// API: add(id: String, fn: Function, ...args)
// return obj
man = flyWeightManager.add('male', (name) => {return {name};}, 'Albert'); // {name: 'Albert'}
woman = flyWeightManager.add('female', (name) => {return {uniqueName: name};}, "Albert's Wife"); // {uniqueName: "Albert's Wife"}

// API: setExternalState(id: String, obj: Object, isChangeObj: Boolean || false)
// return obj
var o = flyWeightManager.setExternalState('male', {hobby: 'program, sing, dance, Astronomy, basketball, cook, not hiphop', worried: 'how to make more money, how to ...'})
var m = flyWeightManager.setExternalState('female', {hobby: 'what', worried: 'what'});

// API: setProp(id: String, prop: String, value: Object, isMerge: Boolean || false)
```

### 装饰者模式/Decorator/AOP
```javaScript
let beforeS = '';
let s = '';
let afterS = '';
let f = function(b, str) {
  return s = str;
};
let bef = function(b, str) {
  return beforeS = b;
};
let af = function(b, str, afS) {
  return afterS = afS;
};
let {beforeFunction, afterFunction} = require('design-pattern-js');
// API: beforeFunction(fn: Function, beforeFn: Function)
let beforeFn = beforeFunction(f, bef);
beforeFn('left', 'middle', 'right'); // middle
beforeS // left
// API: afterFunction(fn: Function, afterFn: Function)
let afterFn = afterFunction(f, af);
afterFn('left', 'middleBefore', 'right');  // middleBefore
afterS // right
```
### 发布-订阅/EventEmitter/PublishSubscribe
```javaScript
// 详见Nodejs Event模式
// 增加离线功能，先发布后订阅功能
// Use:
// new EventEmitter(isOffline: Boolean);

let {EventEmitter} = require('design-pattern-js');
let e = new EventEmitter(true);
let r = '';
e.emit('s', 's');
e.on('s', (s) => {r = s}); //true
r // 's'
```

### 中介者模式/Mediator
```javaScript
// Use:
// new MediatorFactory([{name:String, fn: Function}, ...])
// new MediatorFactory({name:String, fn: Function}, ...)

let receivers = {};
let addReceiver = function addReceiver(receiver) {
  var c = receiver.c;
  receivers[c] = receivers[c] || [];
  receivers[c].push(receiver);
  return receivers;
}
let arr = [{name: 'addReceiver', fn: addReceiver}];

let {MediatorFactory} = require('design-pattern-js');
let mediator = new MediatorFactory(arr);
// API: receiverMessage(String, ...args);
let r = mediator.receiverMessage('addReceiver', { c: 'color' });
r // {color: [{c: 'color'}]}
receivers // {color: [{c: 'color'}]}
```

### 单例模式
```javaScript
// Use:
// new String(Function)


let {Single} = require('design-pattern-js');
let single = new Single((...args) => {return [...args];});
// API: getInstance(...args)
let ret = single.getInstance(1, 2, 3, 4, 5); // true
ret === single.getInstance(1, 2, 3, 4, 5); // true
ret === single.getInstance(); // true

let other = new Single((...args) => {return [...args];});
ret !== other.getInstance(1, 2, 3, 4, 5); // true
```



# to do
- [x] add babel
- [x] add rollup
- [x] add test module
- [ ] add async test module
- [x] add travis ci
- [x] add npm module
- [x] add example code
- [ ] add more example code
- [ ] add changelog script and some useful scripts
- [ ] add others pattern or useful enclosure function | class
