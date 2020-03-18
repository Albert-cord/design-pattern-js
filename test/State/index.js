const assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        // use 
        let OffLightState = function () { this.a = 0; return this;};
        OffLightState.prototype.buttonWasPressed = function () {
            console.log('弱光'); // offLightState 对应的行为
        };
        OffLightState.prototype.buttonWasPressed.nextState = 'ruoguang4'

        let OffLightState1 = function () { this.aa = 1; return this;};
        OffLightState1.prototype.buttonWasPressed = function () {
            console.log('弱光1'); // offLightState 对应的行为
        };
        OffLightState1.prototype.buttonWasPressed.nextState = 'ruoguang1';
        let OffLightState2 = function () { this.aaa = 2; return this;};
        OffLightState2.prototype.buttonWasPressed = function () {
            console.log('弱光2'); // offLightState 对应的行为
        };
        OffLightState2.prototype.buttonWasPressed.nextState = 'ruoguang3';
        let OffLightState3 = function () { this.aaaa = 3;return this;};
        OffLightState3.prototype.buttonWasPressed = function () {
            console.log('弱光3'); // offLightState 对应的行为
        };
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
        state.currentState.instance.buttonWasPressed();
    });
  });
});
