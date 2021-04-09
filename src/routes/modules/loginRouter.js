import Router from 'koa-router'
import loginController from '../../api/LoginController'
const router = new Router()
router.prefix('/login')

router.post('/forget', loginController.forget)
// 注册验证
router.post('/ver', loginController.verification)
export default router