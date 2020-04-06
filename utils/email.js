const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.to = user.email;
    this.from = `Natours | ${process.env.EMAIL_FROM}`
  }

  createNewTransport() {
    if(process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    }); 
  }

  async send(template, subject) {
    // Send the actual mail
    const html = pug.renderFile(path.join(__dirname, `../views/email/${template}.pug`), {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmlToText.fromString(html), //Skips the html tags and return text only
      html
    };

    await this.createNewTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your Password Reset Token (Valid for 10 minutes only)!');
  }
}

module.exports = Email;
