/**
 * @Author: huangw1
 * @Date: 2019-12-03 20:02
 */

/**
 * just like describe
 */
class Suite {
  constructor (props) {
    this.suites = [];
    this.tests = [];
    this._beforeAll = [];
    this._afterAll = [];
    this._beforeEach = [];
    this._afterEach = [];

    const {title, parent} = props;
    this.title = title;
    this.parent = parent;

    if (parent instanceof Suite) {
      parent.suites.push(this);
    }
  }
}

module.exports = Suite;
