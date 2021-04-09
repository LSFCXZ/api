import svgCaptcha from 'svg-captcha'
import send from '../config/MailConfig'
import moment from 'dayjs'
import { setValue } from '../config/RedisConfig'
class PublicController {
  async getCaptcha (ctx) {
    // 定义svg验证码的格式
    const newCaptcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0Oo1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38
    })
    ctx.body = {
      code: 200,
      data: newCaptcha.data,
      text: newCaptcha.text
    }
  }

  // // 注册邮箱验证码
  // async getMailCode (ctx) {
  //   const { body } = ctx.request
  //   const result = await send({
  //     type: 'vercode',
  //     data: {
  //       key: key,
  //       username: body.username
  //     },
  //     expire: moment()
  //       .add(30, 'minutes')
  //       .format('YYYY-MM-DD HH:mm:ss'),
  //     email: body.username,
  //     user: body.user //user.name ? user.name : body.username
  //   })
  //   ctx.body = {
  //     code: 200,
  //     data: result
  //   }
  // }
}
export default new PublicController()