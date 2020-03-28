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
  describe('#API', function() {
    it('beforeFunction', function() {
      let beforeFn = beforeFunction(f, bef);
      assert.equal(beforeFn('left', 'middle', 'right'), 'middle')
      assert.equal(beforeS, 'left');
      assert.equal(s, 'middle');
    });
    it('afterFunction', function() {
      let afterFn = afterFunction(f, af);
      assert.equal(afterFn('left', 'middleBefore', 'right'), 'middleBefore')
      assert.equal(afterS, 'right');
      assert.equal(s, 'middleBefore');
    });
  });
});
