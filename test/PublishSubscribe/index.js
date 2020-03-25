const assert = require('assert');
import PublishSubscribe from '../../src/PublishSubscribe';
// const PublishSubscribe = require('../../src/PublishSubscribe');

describe('PublishSubscribe', function() {
  let event, offlineEvent;
  before(function() {
    event = new PublishSubscribe();
    offlineEvent = new PublishSubscribe(true);
  })

  describe('#addEventListener()', function() {
    it('addEventListener', function() {
      assert.equal(event.addEventListener('addEventListener', function() {return 'addEventListener';}), true);
      assert.equal(offlineEvent.addEventListener('addEventListener', function() {return 'addEventListener';}), true);
    });
  });
  describe('#setMaxEvents()', function() {
    it('setMaxEvents', function() {
      event.setMaxEvents(2);
      offlineEvent.setMaxEvents(2);
      assert.equal(event._maxEvents, 2);
      assert.equal(offlineEvent._maxEvents, 2);

      assert.equal(event.on('setMaxEvents', function() {return 'setMaxEvents';}), true);
      assert.equal(offlineEvent.on('setMaxEvents', function() {return 'setMaxEvents';}), true);
      assert.equal(event.on('setMaxEvents1', function() {return 'setMaxEvents';}), false);
      assert.equal(offlineEvent.on('setMaxEvents1', function() {return 'setMaxEvents';}), false);
    });

    afterEach(function() {
      event.setMaxEvents(PublishSubscribe.defaultMaxEvents);
      offlineEvent.setMaxEvents(PublishSubscribe.defaultMaxEvents);
      assert.equal(event._maxEvents, 100);
      assert.equal(offlineEvent._maxEvents, 100);
    });
  });

  describe('#setMaxListeners()', function() {
    it('setMaxListeners', function() {
      event.setMaxListeners(2);
      offlineEvent.setMaxListeners(2);
      assert.equal(event._maxListeners, 2);
      assert.equal(offlineEvent._maxListeners, 2);

      assert.equal(event.on('addEventListener', function() {return 'addEventListener2';}), true);
      assert.equal(offlineEvent.on('addEventListener', function() {return 'addEventListener2';}), true);
      assert.equal(event.on('addEventListener', function() {return 'addEventListener3';}), false);
      assert.equal(offlineEvent.on('addEventListener', function() {return 'addEventListener3';}), false);
    });

    afterEach(function() {
      event.setMaxListeners(PublishSubscribe.defaultMaxListeners);
      offlineEvent.setMaxListeners(PublishSubscribe.defaultMaxListeners);
      assert.equal(event._maxListeners, 100);
      assert.equal(offlineEvent._maxListeners, 100);
    });
  });

  describe('#on()', function() {
    it('on', function() {
      assert.equal(event.on('on', function() {return 'on';}), true);
      assert.equal(offlineEvent.on('on', function() {return 'on';}), true);

    });
  });

  describe('#eventNames()', function() {
    it('eventNames', function() {
      assert.deepEqual(event.eventNames(), ['addEventListener', 'setMaxEvents', 'on']);
      assert.deepEqual(offlineEvent.eventNames(), ['addEventListener', 'setMaxEvents', 'on']);
    });
  });

  describe('#listenerCount()', function() {
    it('listenerCount', function() {
      assert.equal(event.listenerCount('addEventListener'), 2);
      assert.equal(offlineEvent.listenerCount('addEventListener'), 2);
      assert.equal(offlineEvent.listenerCount('on'), 1);
      assert.equal(offlineEvent.listenerCount('on'), 1);
      assert.equal(offlineEvent.listenerCount('null'), 0);
      assert.equal(offlineEvent.listenerCount('null'), 0);
    });
  });

  describe('#listeners()', function() {
    it('listeners', function() {
      let arr = [function() {return 'addEventListener';}, function() {return 'addEventListener2';}, function() {return 'addEventListener3';}];
      arr.forEach(a => {
        event.on('addEventListenerEvt', a);
        offlineEvent.on('addEventListenerEvt', a);
      })

      assert.deepEqual(event.listeners('addEventListenerEvt'), arr);
      assert.deepEqual(offlineEvent.listeners('addEventListenerEvt'), arr);
      let otherArr = [function() {return 'on';}];
      otherArr.forEach(a => {
        event.on('onFn', a);
        offlineEvent.on('onFn', a);
      })

      assert.deepEqual(event.listeners('onFn'), [...otherArr]);
      assert.deepEqual(offlineEvent.listeners('onFn'), [...otherArr]);
      assert.deepEqual(event.listeners('null'), []);
      assert.deepEqual(offlineEvent.listeners('null'), []);
    });
  });

  describe('#off()', function() {
    it('off', function() {
      let fn = function() {return 'fn';};
      let ofn = function() {return 'ofn';};
      event.on('fn', fn);
      offlineEvent.on('fn', fn);
      event.on('fn', ofn);
      offlineEvent.on('fn', ofn);
      assert.deepEqual(event.listeners('fn'), [fn, ofn]);
      assert.deepEqual(offlineEvent.listeners('fn'), [fn, ofn]);

      event.off('fn', fn);
      offlineEvent.off('fn', fn);

      assert.deepEqual(event.listeners('fn'), [ofn]);
      assert.deepEqual(offlineEvent.listeners('fn'), [ofn]);

      event.off('fn');
      offlineEvent.off('fn');

      assert.deepEqual(event.listeners('fn'), []);
      assert.deepEqual(offlineEvent.listeners('fn'), []);
    });
  });

  describe('#once()', function() {



    it('once', function() {
      let ret = '';
      let ret_ = '';
      let fnStr = 'fn';
      // let ofnStr = 'ofn';
      let onceFnStr = 'onceFn';
      let onceOfnStr = 'onceOfn';

      let fn = function(s) {ret = s;};
      let onceFn = function(s) {ret_ = onceFnStr;};
      let ofn = function(s) {ret = s+'_once';};
      // let onceOofn = function(s) {ret_ = s;};

      let onceOfn = function(s) {ret_ = onceOfnStr;};

      // event.on('ofn', ofn);
      // offlineEvent.on('ofn', ofn);
      event.on('fn', fn);
      offlineEvent.on('fn', onceFn);

      event.once('fn', ofn);
      offlineEvent.once('fn', onceOfn);
      // event.once('ofn', onceOfn);
      // offlineEvent.once('ofn', onceOfn);



      event.emit('fn', fnStr);
      offlineEvent.emit('fn', fnStr);
      assert.deepEqual([ret, ret_], ['fn_once', 'onceOfn']);

      event.emit('fn', fnStr);
      offlineEvent.emit('fn', fnStr);
      assert.deepEqual([ret, ret_], ['fn', 'onceFn']);

    });
  });

  describe('#isOnOfflineStack mode', function() {



    it('isOnOfflineStack = true; emit, on, once', function() {
      let ret = '';
      offlineEvent.emit('neverOn', 'nerverOn')
      offlineEvent.on('neverOn', (s) => {ret = s;})
      assert.equal(ret, 'nerverOn');

      offlineEvent.emit('neverOn', 'right')
      assert.equal(ret, 'right');

      offlineEvent.emit('neverOnce', 'neverOnce')

      offlineEvent.once('neverOnce', (s) => {ret = s;})
      assert.equal(ret, 'neverOnce');

      offlineEvent.emit('neverOnce', 'neverOnceRight');
      assert.equal(ret, 'neverOnceRight');
      offlineEvent.emit('neverOnce', 'not');

      assert.equal(ret, 'neverOnceRight');
      assert.notEqual(ret, 'not');
      
    });
  });
});
