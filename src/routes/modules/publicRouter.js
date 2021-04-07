import Router from 'koa-router'
import publicController from '../../api/PublicController'
const router = new Router()
router.prefix('/public')

// 获取图片验证码
router.get('/getCaptcha', publicController.getCaptcha)
export default router