import koa from 'koa'
const app = new koa()

app.use(async ctx => {
  ctx.body = 'Hello!!!'
})

app.listen(3000)