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

    // 这里的fns is not defined ,cannot catch from upper scope
    it('#insertByPosition number', function() {
      let nextKey = 'nextKey';
      let checkRet = '';
      // let fn = 
      function fn(f) {
        if(f()) {
          return nextKey;
        } else {
          checkRet = 'fn';
        }
      };
      // cannot setter readonly property
      // fn.name = 'fn'
      // let otherFn = 
      function otherFn(f, f1) {
        if(f1()) {
          return nextKey;
        } else {
          checkRet = 'otherFn';
        }
      };
      // let insertFn = 
      // name property lost
      function insertFn(f, f1, f2) {
        if(f2()) {
          return nextKey;
        } else {
          checkRet = 'insertFn';
        }
      };
      // let insteadOfFn = 
      function insteadOfFn(f, f1, f2, f3) {
        if(f3()) {
          return nextKey;
        } else {
          checkRet = 'insteadOfFn';
        }
      };

      let fns = [fn, otherFn, insertFn, insteadOfFn];
      
      dc = new DutyChains({nextKey, fns: fns.slice(0, 2)});
      assert.equal(dc.insert(0, fns[2]), true);
      dc.start(() => true, () => false, () => false);
      assert.equal(checkRet, 'insertFn');
      // mocha's Context cause function name lost
      // assert.deepEqual(dc.toString(), 'fn->insertFn->otherFn::0->1->2');
      assert.deepEqual(dc.fns, [fns[0], fns[2], fns[1]]);
      dc.instead(0);
      // assert.deepEqual(dc.toString(), 'insertFn->otherFn::0->1');
      assert.deepEqual(dc.fns, [fns[2], fns[1]]);



      dc.start(() => true, () => false, () => false);
      assert.equal(checkRet, 'insertFn');
      // it(`why2`, function() {
  
      // })
      // 这里不能用真名。。。
      // assert.equal(dc.insert(fns[2].name, fns[3]), true);
      assert.equal(dc.insert(0, fns[3]), true);

      // assert.deepEqual(dc.toString(), 'insertFn->insteadOfFn->otherFn::0->1->2');

      assert.deepEqual(dc.fns, [fns[2], fns[3], fns[1]]);
      assert.equal(dc.instead(-1), true, 'dc.instead(-1)');

      // it(`why1`, function() {
  
      // })
      // assert.deepEqual(dc.toString(), 'insertFn->insteadOfFn::0->1');
      assert.deepEqual(dc.fns, [fns[2], fns[3]]);
      assert.equal(dc.instead(-1, ...[fns[3], fns[0], fns[1]]), true, 'dc.instead(-1, ...[insteadOfFn, fn, otherFn])');      

      // it(`why`, function() {
      // })
      // assert.deepEqual(dc.toString(), 'insertFn->insteadOfFn->fn->otherFn::0->1->2->3');
      assert.deepEqual(dc.fns, [fns[2], fns[3], fns[0], fns[1]]);

      
      dc.start(() => false, () => false, () => false, () => false);
      assert.equal(checkRet, 'insertFn');
    });
  });
});
