import Router from 'koa-router'
import loginController from '../../api/LoginController'
const router = new Router()
router.prefix('/login')

// 找回密码
router.post('/forget', loginController.forget)
// 注册验证
router.post('/ver', loginController.verification)
//登录
router.post('/login', loginController.login)
//注册
router.post('/reg', loginController.reg)
export default router