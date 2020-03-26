import FlyWeightManager from '../../src/FlyWeight';
// const flyWeightManager = require('../../src/FlyWeight');

const assert = require('assert');
describe('FlyWeight', function() {
  var man, woman;

  before(function() {
    // 歧义:
    // (name) => {name}
    // (name) => {return {name};}
    let flyWeightManager = new FlyWeightManager();
    man = flyWeightManager.add('male', (name) => {return {name};}, 'Albert');
    woman = flyWeightManager.add('female', (name) => {return {uniqueName: name};}, "Albert's Wife");
  })

  describe('#add()', function() {
    it('add', function() {
      assert.deepEqual(man, {name: 'Albert'});
      assert.deepEqual(woman, {uniqueName: "Albert's Wife"});
    });
  });

  describe('#setExternalState()', function() {
    it('setExternalState', function() {
      var o = flyWeightManager.setExternalState('male', {hobby: 'program, sing, dance, Astronomy, basketball, cook, not hiphop', worried: 'how to make more money, how to ...'})
      var m = flyWeightManager.setExternalState('female', {hobby: 'what', worried: 'what'});

      assert.deepEqual(o, man);
      assert.deepEqual(m, woman);

      assert.deepEqual(o, {name: 'Albert', hobby: 'program, sing, dance, Astronomy, basketball, cook, not hiphop', worried: 'how to make more money, how to ...'});
      assert.deepEqual(m, {uniqueName: "Albert's Wife", hobby: 'what', worried: 'what'});

    });
  });
});
