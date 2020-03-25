import MediatorFactory from '../../src/Mediator';
// const mediatorFactory = require('../../src/Mediator');

const assert = require('assert');
describe('Mediator', function() {
  describe('#receiverMessage()', function() {
    it('receiverMessage', function() {
    //   assert.equal([1, 2, 3].indexOf(4), -1);
    
    // use instance
    // named scope uglify and lost
    // so use arr
    let receivers = {};
    
    let addReceiver = function addReceiver(receiver) {
      var c = receiver.c;
      receivers[c] = receivers[c] || [];
      receivers[c].push(receiver);
      return receivers;
    }
    let arr = [addReceiver];
    let mediator = new MediatorFactory(arr)
    let r = mediator.receiverMessage(arr[0].name, { c: 'color' });

    assert.deepEqual(Object.values(mediator.mediatorOperations), [addReceiver]);
    assert.deepEqual(r, {color: [{c: 'color'}]});
    assert.deepEqual(receivers, {color: [{c: 'color'}]});

    });
  });
});
