import {beforeFunction, afterFunction} from '../../src/Decorator';
// const {beforeFunction, afterFunction} = require('../../src/Decorator');


const assert = require('assert');
describe('Decorator', function() {
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
  // before(function() {
    
  // });
  describe('#beforeFunction()', function() {
    it('beforeFunction', function() {
      let beforeFn = beforeFunction(bef, f);
      beforeFn('left', 'middle', 'right');
      assert.equal(beforeS, 'left');
      assert.equal(s, 'middle');
    });
    it('afterFunction', function() {
      let afterFn = afterFunction(f, af);
      afterFn('left', 'middleBefore', 'right');
      assert.equal(afterS, 'right');
      assert.equal(s, 'middleBefore');
    });
  });
});
