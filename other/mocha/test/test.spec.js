const assert = require('assert');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4))
    });
  });

  describe('#every()', function () {
    it('should return true when all items are satisfied', function () {
      assert.equal(true, [1, 2, 3].every(item => !isNaN(item)))
    })
  })
});

describe('String', function () {
  describe('#replace', function () {
    it('should return a string that has been replaced', function () {
      assert.equal('hi Huangw1', 'hi Huangw1'.replace('Huangw1', 'Huangwenlong'))
    })
  })
});
