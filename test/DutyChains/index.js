import DutyChains from '../../src/DutyChains';
import {Chain} from '../../src/DutyChains';
// const DutyChains = require('../../src/DutyChains');
// const {Chain} = require('../../src/DutyChains');


const assert = require('assert');
describe('DutyChains', function() {
  let fn, otherFn, insertFn, insteadOfFn;
  let nextKey = 'nextKey';
  let checkRet = '';
  before(function() {
    fn = function fn(f) {
      if(f()) {
        return nextKey;
      } else {
        checkRet = 'fn';
      }
    };
    otherFn = function otherFn(f, f1) {
      if(f1()) {
        return nextKey;
      } else {
        checkRet = 'otherFn';
      }
    };
    insertFn = function insertFn(f, f1, f2) {
      if(f2()) {
        return nextKey;
      } else {
        checkRet = 'insertFn';
      }
    };
    insteadOfFn = function insteadOfFn(f, f1, f2, f3) {
      if(f3()) {
        return nextKey;
      } else {
        checkRet = 'insteadOfFn';
      }
    };
  })

  describe('#DutyChains', function() {
    let fns, dc, a, b, m;
    beforeEach(function() {
      fns = [fn, otherFn];
      
      a = new Chain(fn, 0);
      b = new Chain(otherFn, 1);
      a.setNext(b);
      m = new Map();
      m.set('fn', a);
      m.set('otherFn', b);
    });
    it('initial by {nextKey, fns}', function() {
      dc = new DutyChains({nextKey, fns});
      assert.deepEqual(dc, {nextKey, fns, length: fns.length, hashChainMap: m, head: a});
    });
    it('initial by nextKey, ...fns', function() {
      dc = new DutyChains(nextKey, ...fns);
      assert.deepEqual(dc, {nextKey, fns, length: fns.length, hashChainMap: m, head: a});
    });

    it('#clean', function() {
      dc = new DutyChains(nextKey, fns);
      dc.clear();
      assert.equal(dc.head, null);
      assert.equal(dc.length, 0);
      assert.deepEqual(dc.fns, []);
    });
    it('#start', function() {
      dc = new DutyChains({nextKey, fns});
      dc.start(() => true, () => false);
      assert.equal(checkRet, 'otherFn');
    });
    it('#startUseContext', function() {
      dc = new DutyChains({nextKey, fns});
      dc.start(() => true, () => false);
      assert.equal(checkRet, 'otherFn');
      dc.startUseContext({context: {f: false}, args: [() => this.f, () => this.f]});
      assert.equal(checkRet, 'fn');
    });
    it('#insertByPosition number', function() {
      dc = new DutyChains({nextKey, fns});
      assert.equal(dc.insert(0, insertFn), true);
      dc.start(() => true, () => false);
      assert.equal(checkRet, 'insertFn');
      dc.instead(0);
      dc.start(() => true, () => false);
      assert.equal(checkRet, 'otherFn');

      assert.equal(dc.insert('fn', insteadOfFn), true);
      dc.start(() => false, () => false);
      assert.equal(checkRet, 'insteadOfFn');
    });
  });
});
