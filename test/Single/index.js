const assert = require('assert');
import Single from '../../src/Single';
describe('Single', function() {
  describe('#getInstance()', function() {
    it('should return instance', function() {
      let single = new Single(((...arg) => {return [...args];}));
      let ret = single.getInstance(1, 2, 3, 4, 5);
      assert.equal(ret, single.getInstance(1, 2, 3, 4, 5));
    });
  });
});
