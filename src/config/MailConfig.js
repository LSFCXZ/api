import nodemailer from "nodemailer";

const toSendSms = (option, sendInfo) => {
  option.subject = '您好，您在Lay社区的验证码'
  option.text = `您正在绑定邮箱，验证码为：${sendInfo.code}，验证码过期时间：${sendInfo.expire}。如非本人操作，请忽略本信息。本信息5分钟内有效`
  option.html = ''
}
async function send (sendInfo, isSendSms) {
  let transporter = nodemailer.createTransport({
    host: "smtpdm.aliyun.com",
    port: 465,//465需要SSL
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'blog@blog.frontblog.top', // generated ethereal user
      pass: '20150727lsfLSF', // generated ethereal password
    },
  });
  let url = 'http://www.baidu.com'
  /**
   * 这里分三种情况:
   * 1:忘记密码找回密码
   * 2:注册发送验证码
   * 3:登陆后修改密码，确认邮件
   */
  const mailOptions = {
    from: '"认证邮件" <blog@blog.frontblog.top>', // sender address
    to: sendInfo.email, // list of receivers
    subject: sendInfo.user !== '' && sendInfo.type !== 'email'
      ? `您好，${sendInfo.user}！《Lay社区》${sendInfo.type === 'reset' ? '重置密码链接' : '验证码'}`
      : '《Lay社区》确认修改邮件链接', // Subject line
    text: `《Lay社区》验证码${sendInfo.code
      },邀请码的过期时间: ${sendInfo.expire}`, // plain text body
    html: `
        <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
        <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">欢迎来到官方社区</div>
        <div style="padding: 25px">
          <div>您好，${sendInfo.user}，重置链接有效时间30分钟，请在${sendInfo.expire
      }之前${sendInfo.code ? '重置您的密码' : '修改您的邮箱为：' + sendInfo.data.username}：</div>
          <a href="${url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">${sendInfo.code ? '立即重置密码' : '确认设置邮箱'}</a>
          <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
        </div>
        <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>
    `
  };
  // 发送验证码
  if (isSendSms) {
    toSendSms(mailOptions, sendInfo)
  }
  const info = await transporter.sendMail(mailOptions)
  return `Message sent: %s', ${info.messageId}`
}

export default send