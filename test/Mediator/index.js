import mediatorFactory from '../../src/Mediator';
// const mediatorFactory = require('../../src/Mediator');

const assert = require('assert');
describe('Mediator', function() {
  describe('#receiverMessage()', function() {
    it('receiverMessage', function() {
    //   assert.equal([1, 2, 3].indexOf(4), -1);
    
    // use instance

    var receivers = {};
    let addReceiver = function addReceiver(receiver) {
      var c = receiver.c;
      receivers[c] = receivers[c] || [];
      receivers[c].push(receiver);
      console.log(receivers)
    }
    var mediator = mediatorFactory([addReceiver])
    mediator.receiverMessage('addReceiver', { c: 'color' })

    assert.deepEqual(receivers, {'color': [{c: 'color'}]});
    assert.deepEqual(mediator[mediatorOperations], {addReceiver: addReceiver});
    });
  });
});
