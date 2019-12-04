/**
 * @Author: huangw1
 * @Date: 2019-12-04 09:41
 */
const Suite = require("../src/suite");
const Test = require("../src/test");
const {toPromise} = require("../src/helper");

module.exports = (context, root) => {
  const suites = [root];

  // 深度优先遍历 -> 栈（stack）
  context.describe = function (title, fn) {
    const [parent] = suites;
    const suite = new Suite({
      title,
      parent
    });
    suites.unshift(suite);
    fn.call(suite);
    suites.shift();
  };

  context.it = function (title, fn) {
    const [parent] = suites;
    const test = new Test({
      title,
      fn: toPromise(fn)
    });
    parent.tests.push(test);
  };

  context.before = function (fn) {
    const [parent] = suites;
    parent._beforeAll.push(toPromise(fn));
  };

  context.after = function (fn) {
    const [parent] = suites;
    parent._afterAll.push(toPromise(fn));
  };

  context.beforeEach = function (fn) {
    const [parent] = suites;
    parent._beforeEach.push(toPromise(fn));
  };

  context.afterEach = function (fn) {
    const [parent] = suites;
    parent._afterEach.push(toPromise(fn));
  };

  return suites
};
