const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const { Member } = require('../models/Member');

const sendMail = async function (req,to,data) {
  return new Promise((resolve, reject) =>{
    try {
      let transporter = nodemailer.createTransport({
        host: '[email-smtp.us-east-1.amazonaws.com]',
        port: 587,
        auth: {
          user: 'AKIA5GCLHGMULHIIYIMD',
          pass: 'BMgupnIHZo+leAgcfgdF0pjYF2z/R4c2GQ1PSJoE4LFx'
        }
      });

      let result = await transporter.sendMail({
        from:'"LGS TeamBuilder" <no-reply@teambuilder.garneau.com>',
        to: to,
        subject: "TeamBuilder Password Reset",
        text: `Hello, we received a request to reset your password!
        You can go ahead and do so by clicking the link below:
        http://${req.headers.host}/reset?token=${data.token}

        If you did not request a password reset, you can ignore this email.
        `,
        html: `<b>Hello, we received a request to reset your password!</b><br><br>
        You can go ahead and do so by clicking the link below:<br>
        <a href="http://${req.headers.host}/reset?token=${data.token}">Reset My Password</a><br><br>
        
        If you did not request a password reset, you can ignore this email.
        `
      })

      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
};

module.exports = sendMail;
