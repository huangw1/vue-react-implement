/**
 * @Author: huangw1
 * @Date: 2019-12-04 12:03
 */
const {constants} = require('../src/runner');

module.exports = (runner) => {
  let indents = 0;
  let passes = 0;
  let failures = 0;

  const colors = {
    pass : 90,
    fail : 31,
    green: 32
  };

  const indent = (i = 0) => {
    return Array(indents + i).join('  ');
  };

  const color = (type, str) => {
    return '\u001b[' + colors[type] + 'm' + str + '\u001b[0m';
  };

  runner.on(constants.EVENT_RUN_BEGIN, function() {

  });

  runner.on(constants.EVENT_SUITE_BEGIN, function(suite) {
    ++indents;
    console.log(indent(), suite.title);
  });

  runner.on(constants.EVENT_SUITE_END, function() {
    --indents;
  });

  runner.on(constants.EVENT_PASS, function(title) {
    passes++;

    const fmt = indent(1) + color('green', '  ✓') + color('pass', ' %s');
    console.log(fmt, title);
  });

  runner.on(constants.EVENT_FAIL, function(title) {
    failures++;

    const fmt = indent(1) + color('fail', '  × %s');
    console.log(fmt, title);
  });

  runner.on(constants.EVENT_RUN_END, function() {

  });
};
