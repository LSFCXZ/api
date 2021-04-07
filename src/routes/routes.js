import combineRouters from 'koa-combine-routers'
import publicRouter from './modules/publicRouter'
export default combineRouters(publicRouter)