/**
 * @Author: huangw1
 * @Date: 2020-05-01 13:46
 */

const { resolve, join, parse } = require('path');
const globby = require('globby');

module.exports = app => {
  const appPath = resolve(__dirname, 'app');
  const context = app.context;

  // 顺序不能乱
  const fileAbsolutePath = ['config', 'middleware', 'service'].reduce((folderMap, v) => {
    folderMap[v] = join(appPath, v);
    return folderMap
  }, {});
  Object.entries(fileAbsolutePath).forEach(([prop, path]) => {
    const files = globby.sync('**/*.js', {
      cwd: path
    });
    if (prop !== 'middleware') {
      context[prop] = {};
    }
    files.forEach(file => {
      const filename = parse(file).name;
      const content = require(join(path, file));

      if(prop === 'middleware') {
        if (filename in context['config']) {
          const plugin = content(context['config'][filename]);
          app.use(plugin);
        }
        return
      }
      if (prop === 'config') {
        context[prop] = Object.assign({}, context[prop], content);
        return
      }
      context[prop][filename] = content;
    });
  })
};
