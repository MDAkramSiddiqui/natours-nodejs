const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    //1. Create a transporter
    // service: 'Gmail' //Some services provides dierect support like gmail, yahoo, hotmail and for others we have to provide it oursleves, howeverr for gmail we have to activate less secure app option
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //2. Define the email option
  const mailOptions = {
    from: 'Mohammad Akram <hello@mdkaram.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html
  }

  //3. Actually send the email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;