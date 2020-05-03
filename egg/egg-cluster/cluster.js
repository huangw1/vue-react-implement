/**
 * @Author: huangw1
 * @Date: 2020-05-01 15:43
 */

const cfork = require('cfork');
const chokidar = require('chokidar');
const { resolve } = require('path');
const reload = require('cluster-reload');

const master = cfork({
  exec: resolve(__dirname, 'index.js'),
  count: 2
});

chokidar.watch('./app').on('change', (event, path) => {
  reload(2);
});


