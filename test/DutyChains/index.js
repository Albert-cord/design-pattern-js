import DutyChains from '../../src/DutyChains';
import {Chain} from '../../src/DutyChains';


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
      fns = [{fn, name: 'fn'}, {fn: otherFn, name: 'otherFn'}];
      
      a = new Chain({fn: fn, name: 'fn'}, 0);
      b = new Chain({fn: otherFn, name: 'otherFn'}, 1);
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

      let fns = [{fn, name: 'fn'}, {fn: otherFn, name: 'otherFn'}, {fn: insertFn, name: 'insertFn'}, {fn: insteadOfFn, name: 'insteadOfFn'}];
      
      dc = new DutyChains({nextKey, fns: [{fn, name: 'fn'}, {fn: otherFn, name: 'otherFn'}]});
      assert.equal(dc.insert(0, {fn: insertFn, name: 'insertFn'}), true);
      dc.start(() => true, () => false, () => false);
      assert.equal(checkRet, 'insertFn');
      // mocha's Context cause function name lost
      assert.deepEqual(dc.toString(), 'fn->insertFn->otherFn::0->1->2');
      assert.deepEqual(dc.fns, [{fn, name: 'fn'}, {fn: insertFn, name: 'insertFn'}, {fn: otherFn, name: 'otherFn'}]);
      dc.instead(0);
      assert.deepEqual(dc.toString(), 'insertFn->otherFn::0->1');
      assert.deepEqual(dc.fns, [{fn: insertFn, name: 'insertFn'}, {fn: otherFn, name: 'otherFn'}]);



      dc.start(() => true, () => false, () => false);
      assert.equal(checkRet, 'insertFn');

      assert.equal(dc.insert('insertFn', {fn: insteadOfFn, name: 'insteadOfFn'}), true);

      assert.deepEqual(dc.toString(), 'insertFn->insteadOfFn->otherFn::0->1->2');

      assert.deepEqual(dc.fns, [{fn: insertFn, name: 'insertFn'}, {fn: insteadOfFn, name: 'insteadOfFn'}, {fn: otherFn, name: 'otherFn'}]);
      assert.equal(dc.instead(-1), true, 'dc.instead(-1)');

      assert.deepEqual(dc.toString(), 'insertFn->insteadOfFn::0->1');
      assert.deepEqual(dc.fns, [{fn: insertFn, name: 'insertFn'}, {fn: insteadOfFn, name: 'insteadOfFn'}]);
      assert.equal(dc.instead(-1, ...[{fn: insteadOfFn, name: 'insteadOfFn'}, {fn, name: 'fn'}, {fn: otherFn, name: 'otherFn'}]), true, 'dc.instead(-1, ...[insteadOfFn, fn, otherFn])');      

      assert.deepEqual(dc.toString(), 'insertFn->insteadOfFn->fn->otherFn::0->1->2->3');
      assert.deepEqual(dc.fns, [{fn: insertFn, name: 'insertFn'}, {fn: insteadOfFn, name: 'insteadOfFn'}, {fn, name: 'fn'}, {fn: otherFn, name: 'otherFn'}]);

      
      dc.start(() => false, () => false, () => false, () => false);
      assert.equal(checkRet, 'insertFn');
    });
  });
});
