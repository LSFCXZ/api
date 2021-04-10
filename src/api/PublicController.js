import svgCaptcha from 'svg-captcha'
import send from '../config/MailConfig'
import moment from 'dayjs'
import { setValue, getValue } from '../config/RedisConfig'
class PublicController {
  async getCaptcha (ctx) {
    const body = ctx.request.query
    // 定义svg验证码的格式
    const newCaptcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0Oo1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38
    })
    //保存验证码10分钟
    setValue(body.sid, newCaptcha.text, 10 * 60)
    ctx.body = {
      code: 200,
      data: newCaptcha.data
    }
  }

}
export default new PublicController()