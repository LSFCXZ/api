import send from '../config/MailConfig'
import moment from 'dayjs'
import jsonwebtoken from 'jsonwebtoken'
import { setValue, getValue } from '../config/RedisConfig'
import config from '../config'
import { cheackCode } from '../common/utils'
import User from '../model/User'
import bcrypt from 'bcryptjs'
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
      let checkpassword = false
      const user = await User.findOne({ username: body.username })
      // 解密比对
      if (await bcrypt.compare(body.password, user.password)) {
        checkpassword = true
      }
      if (checkpassword) {
        // 生成Tonken,有效期1d=>1天
        const token = jsonwebtoken.sign({ _id: '6071242df2fcfb19148c0942' }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        ctx.body = {
          code: 200,
          token: token,
          msg: '登录成功'
        }
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
    // 接受用户数据
    const { body } = ctx.request
    const sid = body.sid
    const uid = body.uid
    const vcode = body.vcode
    const code = body.code
    // console.log('vcode is a' + vcode);
    // console.log('uid is a' + uid);
    // 这里msg是返回前端显示的格式
    const msg = {}
    // 验证图片验证码的时效性、正确性
    const result = await cheackCode(sid, code)
    // 验证邮箱验证码的时效性、正确性
    const result1 = await cheackCode(uid, vcode)
    // 判断注册用户是否被注册
    let check = true
    //在图片验证和邮箱验证通过的情况下
    if (result && result1) {
      // 校验username
      const user1 = await User.findOne({ username: body.username })
      if (user1 !== null && typeof user1.username !== 'undefined') {
        // 这里的username对应前端的username，方便显示在对应位置
        msg.username = ['此邮箱已经被注册,请登录']
        check = false
      }
      // 校验name
      const user2 = await User.findOne({ username: body.username })
      if (user2 !== null && typeof user2.name !== 'undefined') {
        msg.name = ['此昵称已经被使用，请修改']
        check = false
      }
      // 写入数据库
      if (check) {
        // 给密码加密，bcrypt
        body.password = await bcrypt.hash(body.password, 10)
        const user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          // 创建用户时间
          created: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        const result = await user.save()
        ctx.body = {
          code: 200,
          data: result,
          msg: '注册成功'
        }
        return
      }
    } else if (result1 === false) {
      msg.vcode = ['邮箱验证码错误，请重新检查']
    } else if (result == false) {
      msg.code = ['验证码错误']
    }
    ctx.body = {
      code: 500,
      msg: msg
    }
  }
}
export default new LoginController()