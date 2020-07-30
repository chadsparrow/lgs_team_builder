const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.SES_SMTP,
  port: process.env.SES_PORT,
  auth: {
    user: process.env.SES_AUTH_USERNAME,
    pass: process.env.SES_AUTH_PASSWORD,
  },
});

module.exports = {
  sendEmail: ({ to, subject, text, html }) => {
    return new Promise((resolve, reject) => {
      if (!to || to === '') {
        reject(new Error('"To" field required'));
      }

      transport.sendMail(
        {
          from: '"LGS TeamBuilder" <no-reply@teambuilder.garneau.com>',
          to,
          subject,
          text,
          html,
        },
        (err, info) => {
          if (err) reject(err);
          resolve(info);
        }
      );
    });
  },
};
