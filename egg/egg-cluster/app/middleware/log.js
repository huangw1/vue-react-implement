/**
 * @Author: huangw1
 * @Date: 2020-05-01 14:23
 */

module.exports = (config) => {
  return async (ctx, next) => {
    console.log(config.format(ctx.url));
    await next();
  }
};
