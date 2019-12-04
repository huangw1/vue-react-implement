/**
 * @Author: huangw1
 * @Date: 2019-12-04 11:03
 */

const {EventEmitter} = require('events');

const constants = {
  EVENT_RUN_BEGIN  : 'EVENT_RUN_BEGIN',
  EVENT_RUN_END    : 'EVENT_RUN_END',
  EVENT_SUITE_BEGIN: 'EVENT_SUITE_BEGIN',
  EVENT_SUITE_END  : 'EVENT_SUITE_END',
  EVENT_FAIL       : 'EVENT_FAIL',
  EVENT_PASS       : 'EVENT_PASS'
};

class Runner extends EventEmitter {
  constructor () {
    super();

    this.suites = []
  }

  async run (root) {
    this.emit(constants.EVENT_RUN_BEGIN);
    await this.runSuite(root);
    this.emit(constants.EVENT_RUN_END);
  }

  async runSuite (suite) {
    this.emit(constants.EVENT_SUITE_BEGIN, suite)

    // 1)
    if (suite._beforeAll.length) {
      for (let fn of suite._beforeAll) {
        const result = await fn();
        if (result instanceof Error) {
          this.emit(constants.EVENT_FAIL, `beforeAll hook in ${suite.title}: ${result.message}`);
          return
        }
      }
    }

    // 2)
    this.suites.unshift(suite);

    // 3)
    if (suite.tests.length) {
      for (const test of suite.tests) {
        await this.runTest(test);
      }
    }

    // 4）
    if (suite.suites.length) {
      for (const child of suite.suites) {
        await this.runSuite(child);
      }
    }

    // 5）
    this.suites.shift();

    // 6)
    if (suite._afterAll.length) {
      for (let fn of suite._afterAll) {
        const result = await fn();
        if (result instanceof Error) {
          this.emit(constants.EVENT_FAIL, `afterAll hook in ${suite.title}: ${result.message}`);
          return
        }
      }
    }

    this.emit(constants.EVENT_SUITE_END)
  }

  async runTest(test) {
    // 1)
    const _beforeEach = [].concat(this.suites).reverse().reduce((list, suite) => list.concat(suite._beforeEach), []);
    if (_beforeEach.length) {
      for (const fn of _beforeEach) {
        const result = await fn();
        if (result instanceof Error) {
          this.emit(constants.EVENT_FAIL, `beforeEach hook in ${test.title}: ${result.message}`);
          return
        }
      }
    }

    // 2)
    const result = await test.fn();
    if (result instanceof Error) {
      return this.emit(constants.EVENT_FAIL, `${test.title}`);
    } else {
      this.emit(constants.EVENT_PASS, `${test.title}`);
    }

    // 3)
    const _afterEach = [].concat(this.suites).reduce((list, suite) => list.concat(suite._afterEach), []);
    if (_afterEach.length) {
      for (const fn of _afterEach) {
        const result = await fn();
        if (result instanceof Error) {
          this.emit(constants.EVENT_FAIL, `afterEach hook in ${test.title}: ${result.message}`);
          return
        }
      }
    }
  }
}

Runner.constants = constants;

module.exports = Runner;
