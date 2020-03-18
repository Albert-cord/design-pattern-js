const assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
    //   assert.equal([1, 2, 3].indexOf(4), -1);
    
    // use instance

    var receivers = {};
    var mediator = mediatorFactory([function addReceiver(receiver) {
        var c = receiver.c;
        receivers[c] = receivers[c] || [];
        receivers[c].push(receiver);
        console.log(receivers)
    }])
    mediator.receiverMessage('addReceiver', { c: 'color' })
    });
  });
});
