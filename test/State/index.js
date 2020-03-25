const assert = require('assert');
import State from '../../src/State';
import {throwDesignPatternError} from '../../src/utils'
// const State = require('../../src/State');

describe('State', function() {
  describe("inital and tests", function() {
    let state;
    let classes;
    let OffLightState, OffLightState1, OffLightState2, OffLightState3;
    before(function() {
                // use 
                OffLightState = function () { this.a = 0; return this;};
                OffLightState.prototype.buttonWasPressed = function () {
                    // console.log('弱光'); // offLightState 对应的行为
                    return 0;
                };
                OffLightState.prototype.buttonWasPressed.nextState = 'ruoguang4';
                OffLightState.prototype.useElectron = function () {
                    // console.log('弱光'); // offLightState 对应的行为
                    return '0 W';
                };

        
                OffLightState1 = function () { this.aa = 1; return this;};
                OffLightState1.prototype.buttonWasPressed = function () {
                    // console.log('弱光1'); // offLightState 对应的行为
                    return 1;
                };
                OffLightState1.prototype.buttonWasPressed.nextState = 'ruoguang1';
                OffLightState1.prototype.useElectron = function () {
                    // console.log('弱光'); // offLightState 对应的行为
                    return '1 W';
                };

                OffLightState2 = function () { this.aaa = 2; return this;};
                OffLightState2.prototype.buttonWasPressed = function () {
                    // console.log('弱光2'); // offLightState 对应的行为
                    return 2;
                };
                OffLightState2.prototype.buttonWasPressed.nextState = 'ruoguang3';
                OffLightState2.prototype.useElectron = function () {
                    // console.log('弱光'); // offLightState 对应的行为
                    return '2 W';
                };

                OffLightState3 = function () { this.aaaa = 3;return this;};
                OffLightState3.prototype.buttonWasPressed = function () {
                    // console.log('弱光3'); // offLightState 对应的行为
                    return 3;
                };
                OffLightState3.prototype.useElectron = function () {
                    // console.log('弱光'); // offLightState 对应的行为
                    return '3 W';
                };
                OffLightState3.prototype.buttonWasPressed.nextState = 'ruoguang2';
        
                classes = [{
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

    });

    it("#parameter pattern: [{fn, state}]; nextState hooked by unlinked function's static property\n should work by state.currentState.instance function", function() {
        state = new State({fns: classes});
        assert.equal(state.currentState.instance.buttonWasPressed(), 0);
        assert.equal(state.currentState.instance.buttonWasPressed(), 3);
        assert.equal(state.currentState.instance.buttonWasPressed(), 1);
        assert.equal(state.currentState.instance.buttonWasPressed(), 0);
        assert.equal(state.currentState.instance.buttonWasPressed(), 3);
    });

    it("#parameter pattern: fns: [{fn, state}], initialState: 'ruoguang4'; nextState hooked by unlinked function's static property\n should work by state.currentState.instance function", function() {
        state = new State({fns: classes, initialState: 'ruoguang4'});
        assert.equal(state.currentState.instance.buttonWasPressed(), 3);
        assert.equal(state.currentState.instance.buttonWasPressed(), 1);
        assert.equal(state.currentState.instance.buttonWasPressed(), 0);
        assert.equal(state.currentState.instance.buttonWasPressed(), 3);
        assert.equal(state.currentState.instance.buttonWasPressed(), 1);
    });

    it("#parameter pattern: fns: [{fn, state, nextState}], initialState: 'ruoguang4'; nextState hooked by linked function of prop's property\n should work by state.currentState.instance function", function() {
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
        assert.equal(state.currentState.instance.useElectron(), '2 W');
        assert.equal(state.currentState.instance.useElectron(), '3 W');
        assert.equal(state.currentState.instance.useElectron(), '1 W');
        assert.equal(state.currentState.instance.useElectron(), '0 W');
        assert.equal(state.currentState.instance.useElectron(), '2 W');
    });

    it("#parameter pattern: fns: [{fn, state, nextState}], initialState: 'ruoguang4'; nextState hooked by linked function of prop's property\n should work by state.currentState.instance function", function() {
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
        state = new State({fns: otherClasses, initialStateIndex: 2, keyMethods: 'useElectron'});
        assert.equal(state.currentState.instance.useElectron(), '2 W');
        assert.equal(state.currentState.instance.useElectron(), '3 W');
        assert.equal(state.currentState.instance.useElectron(), '1 W');
        assert.equal(state.currentState.instance.useElectron(), '0 W');
        assert.equal(state.currentState.instance.useElectron(), '2 W');
    });

    it("#parameter pattern: fns: [{fn, state, nextState}], initialState: 'ruoguang4'; nextState hooked by linked function of prop's property and can be reset state by setState API\n should work by state.currentState.instance function", function() {
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
        state = new State({fns: otherClasses, initialStateIndex: 2, keyMethods: 'useElectron'});
        assert.equal(state.currentState.instance.useElectron(), '2 W');
        state.setState('ruoguang2');
        assert.equal(state.currentState.instance.useElectron(), '1 W');
        assert.equal(state.currentState.instance.useElectron(), '0 W');
        state.setState('ruoguang2');
        assert.equal(state.currentState.instance.useElectron(), '1 W');
        state.setState('ruoguang4');
        assert.equal(state.currentState.instance.useElectron(), '3 W');
    });

    // how??
    // it("#parameter pattern: {}, should throw error", function() {
    //     try {
    //         new State({})
    //     } catch (error) {
    //         assert.deepEqual(error, throwDesignPatternError('parameterError: fns cannot without function', 'StateError'));
    //     }
    // });
  });
});
