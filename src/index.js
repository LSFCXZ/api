import koa from 'koa'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import json from 'koa-json'
import helmet from 'koa-helmet'
import koastatic from 'koa-static'
import path from 'path'
import compose from 'koa-compose'
import compress from 'koa-compress'
import JWT from 'koa-jwt'
import config from './config/index'
import ErrorHandler from './common/ErrorHandle'
import routes from './routes/routes'
const app = new koa()

// 判断是否为开发模式，是则true，否则false
const isDevMode = process.env.NODE_ENV !== 'production'

// 不需要jwt鉴权的路径
const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /^\/login/] })

/**
 * 使用koa-compose集成中间件
 */
const middleware = compose([
  koaBody(),
  koastatic(path.join(__dirname, '../public')),
  cors(),
  json(),
  helmet(),
  ErrorHandler,
  jwt
])
/**
 * 生产模式压缩中间件
 */
if (!isDevMode) {
  app.use(compress())
}

app.use(middleware)
app.use(routes())
// 开发模式为3000端口，生产模式为12005
const port = !isDevMode ? '12005' : '3000'
// 回调
app.listen(port, () => {
  console.log(`The server is runing at: ${port}`)
})