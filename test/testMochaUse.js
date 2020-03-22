var assert = require('assert');
describe('Array', function() {
    let t = '';
    before(function(){
        t = 'ok';
    })
  describe('#indexOf()', function() {
    beforeEach(function(){
        t = 'each';
    })
    it('t be ok', function() {
      assert.equal(t, 'each')
    });
  });
});