const assert = require('assert');
import PublishSubscribe from '../../src/PublishSubscribe';

describe('PublishSubscribe', function() {
  let event, offlineEvent;
  before(function() {
    event = new PublishSubscribe();
    offlineEvent = new PublishSubscribe(true);
  })

  describe('#addEventListener()', function() {
    it('addEventListener', function() {
      assert.equal(event.addEventListeners('addEventListener', function() {return 'addEventListener';}), true);
      assert.equal(offlineEvent.addEventListeners('addEventListener', function() {return 'addEventListener';}), true);
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
      assert.deepEqual(event.listenerCount('addEventListener'), arr);
      assert.deepEqual(offlineEvent.listenerCount('addEventListener'), arr);
      assert.deepEqual(offlineEvent.listenerCount('on'), [function() {return 'on';}]);
      assert.deepEqual(offlineEvent.listenerCount('on'), [function() {return 'on';}]);
      assert.deepEqual(offlineEvent.listenerCount('null'), []);
      assert.deepEqual(offlineEvent.listenerCount('null'), []);
    });
  });

  describe('#off()', function() {
    it('off', function() {
      let fn = function() {return 'fn';};
      let ofn = function() {return 'ofn';};
      event.on()
      assert.equal(event.listenerCount('addEventListener'), arr);
      assert.equal(offlineEvent.listenerCount('addEventListener'), arr);
      assert.equal(offlineEvent.listenerCount('on'), [function() {return 'on';}]);
      assert.equal(offlineEvent.listenerCount('on'), [function() {return 'on';}]);
      assert.equal(offlineEvent.listenerCount('null'), []);
      assert.equal(offlineEvent.listenerCount('null'), []);
    });
  });
});
