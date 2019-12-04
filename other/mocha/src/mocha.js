/**
 * @Author: huangw1
 * @Date: 2019-12-03 17:18
 */
const Suite = require('./suite');
const Runner = require('./runner');
const { lookupFiles } = require('./helper');
const { BDD } = require('../interfaces');
const { SPEC } = require('../reporters');

class Mocha {
  constructor (dir) {
    this.rootSuite = new Suite({
      title : '',
      parent: null
    });

    // BDD vs TDD
    BDD(global, this.rootSuite);

    const specs = lookupFiles(dir);
    specs.forEach(require);
  }

  run () {
    const runner = new Runner();
    SPEC(runner);
    runner.run(this.rootSuite).then(() => {

    });
  }
}

module.exports = Mocha;
