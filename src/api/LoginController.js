import send from '../config/MailConfig'
import moment from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import { setValue, getValue } from '../config/RedisConfig'
import config from '../config'
import { cheackCode } from '../common/utils'
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
      //这里时随机生成的验证码，需要字符串化才能存到redis
      const uid = (Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)).toString()
      const result = await send({
        type: 'ver',
        code: uid,//验证码
        expire: moment().add(5, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username
      }, true)
      //保存验证码5分钟
      setValue(body.uid, uid, 5 * 60)
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch (e) {
      console.log(e);
    }
  }
  //登录
  async login (ctx) {
    //接受数据
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证验证码
    const result = await cheackCode(sid, code)
    if (result) {
      //验证用户名密码
      const checkpassword = ''
      if (checkpassword) {
        // 生成Tonken,有效期1d=>1天
        const token = jsonwebtoken.sign({ _id: 'userObj._id' }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        ctx.body = {
          code: 200,
          token: token
        }
        console.log(OK);
      } else {
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      ctx.body = {
        code: 401,
        msg: '图片验证码错误，请检查'
      }
    }
  }
  //注册
  async reg (ctx) {

  }
}
export default new LoginController()