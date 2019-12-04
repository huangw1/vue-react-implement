/**
 * @Author: huangw1
 * @Date: 2019-12-04 10:05
 */

const fs = require('fs');
const path = require('path');

module.exports.lookupFiles = (filepath) => {
  try {
    const filePath = `${filepath}.js`;
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      return [filePath];
    }
  } catch (e) {

  }

  let files = [];
  fs.readdirSync(filepath).forEach(name => {
    const pathname = path.join(filepath, name);
    try {
      const stat = fs.statSync(pathname);
      if (stat.isFile()) {
        files.push(pathname);
      } else if (stat.isDirectory()) {
        files = files.concat(lookupFiles(pathname));
      }
    } catch (e) {

    }
  });

  return files
};

module.exports.toPromise = (fn) => {
  return () => {
    return new Promise((resolve) => {
      if (!fn.length) {
        try {
          const res = fn();
          if (res instanceof Promise) {
            res.then(resolve, resolve)
          } else {
            resolve()
          }
        } catch (e) {
          resolve(e)
        }
      } else {
        fn(resolve)
      }
    })
  }
};
