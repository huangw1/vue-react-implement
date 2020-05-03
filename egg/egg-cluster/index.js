/**
 * @Author: huangw1
 * @Date: 2020-05-01 14:14
 */

const Koa = require('koa');
const egg = require('./egg');

const app = new Koa();

egg(app);

app.use(async (ctx, next) => {
  console.log('ctx.config: ', ctx.config);
  console.log('ctx.service: ', ctx.service);

  ctx.type = 'application/json';
  ctx.body = ctx.service.user.getUser();
});

app.listen(3000);
