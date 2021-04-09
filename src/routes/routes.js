import combineRouters from 'koa-combine-routers'
import publicRouter from './modules/publicRouter'
import loginRouter from './modules/loginRouter'
export default combineRouters(publicRouter, loginRouter)