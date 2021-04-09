import send from '../config/MailConfig'
import moment from 'dayjs'
class LoginController {
  constructor() {

  }
  //找回密码
  async forget (ctx) {
    const { body } = ctx.request
    // console.log(body.code);
    try {
      const result = await send({
        type: 'reset',
        code: '1234',
        expire: moment().add(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: body.user
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch (e) {
      console.log(e);
    }
  }
  //注册验证码
  async verification (ctx) {
    const { body } = ctx.request
    try {
      const result = await send({
        type: 'ver',
        code: '1234',//验证码
        expire: moment().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username
      }, true)
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch (e) {
      console.log(e);
    }
  }
}
export default new LoginController()