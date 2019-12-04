/**
 * @Author: huangw1
 * @Date: 2019-10-30 20:53
 */
const path = require('path');
const Mocha = require('./src/mocha');

const spec = path.resolve(__dirname, './test');
const mocha = new Mocha(spec);
mocha.run();
