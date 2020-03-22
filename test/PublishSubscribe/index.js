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
      assert.equal(offlineEvent.on('setMaxEvents', function() {return 'setMaxEvents';}), false);
      assert.equal(offlineEvent.on('setMaxEvents', function() {return 'setMaxEvents';}), false);
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
      assert.equal(offlineEvent.on('addEventListener', function() {return 'addEventListener3';}), false);
      assert.equal(offlineEvent.on('addEventListener', function() {return 'addEventListener3';}), false);
    });

    afterEach(function() {
      event.setMaxEvents(PublishSubscribe.defaultMaxListeners);
      offlineEvent.setMaxEvents(PublishSubscribe.defaultMaxListeners);
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
      assert.equal(event.listenerCount('addEventListener'), 3);
      assert.equal(offlineEvent.listenerCount('addEventListener'), 3);
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
      })
      arr.forEach(a => {
        offlineEvent.on('addEventListenerEvt', a);
      })
      assert.deepEqual(event.listeners('addEventListenerEvt'), arr);
      assert.deepEqual(offlineEvent.listeners('addEventListenerEvt'), arr);
      let onFn = function() {return 'on';}; 
      event.on('onFn', onFn);
      offlineEvent.on('onFn', onFn);

      assert.deepEqual(event.listeners('on'), [onFn]);
      assert.deepEqual(offlineEvent.listeners('on'), [onFn]);
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
      // let onceOfnStr = 'onceOfn';

      let fn = function(s) {ret = s;};
      let onceFn = function(s) {ret = onceFnStr;};
      // let ofn = function(s) {ret_ = s;};
      // let onceOfn = function(s) {ret_ = onceOfnStr;};

      event.on('fn', fn);
      offlineEvent.on('fn', fn);
      // event.on('ofn', ofn);
      // offlineEvent.on('ofn', ofn);

      event.once('fn', onceFn);
      offlineEvent.once('fn', onceFn);
      // event.once('ofn', onceOfn);
      // offlineEvent.once('ofn', onceOfn);

      event.emit('fn', fnStr);
      offlineEvent.emit('fn', fnStr);
      assert.deepEqual([ret, ret_], ['onceFn', 'onceFn']);

      event.emit('fn', fnStr);
      offlineEvent.emit('fn', fnStr);
      assert.deepEqual([ret, ret_], ['fn', 'fn']);

    });
  });

  describe('#isOnOfflineStack mode', function() {



    it('isOnOfflineStack = true; emit, on, once', function() {
      let ret = '';
      event.emit('neverOn', 'nerverOn')
      event.on('neverOn', (s) => {ret = s;})
      assert.equal(ret, 'nerverOn');

      event.emit('neverOn', 'right')
      assert.equal(ret, 'right');

      event.emit('neverOnce', 'neverOnce')

      event.once('neverOnce', (s) => {ret = s;})
      assert.equal(ret, 'neverOnce');

      event.emit('neverOnce', 'neverOnceRight');
      assert.equal(ret, 'neverOnceRight');
      event.emit('neverOnce', 'not');

      assert.equal(ret, 'neverOnceRight');
      assert.notEqual(ret, 'not');
      
    });
  });
});
