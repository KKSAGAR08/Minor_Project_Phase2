const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

module.exports = class Email {
  constructor(user, url) {
    (this.to = user.student_email),
      (this.from = "kksagar08062004@gmail.com"),
      (this.userName = user.student_name),
      (this.url = url);
  }

  createTransport() {
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(fileName, subject) {
    const templatePath = path.join(
      __dirname,
      `../public/pages/${fileName}.html`
    );
    let html = fs.readFileSync(templatePath, "utf-8");

    html = html
      .replace(/{{REGISTER_LINK}}/g, this.url) // Replace link placeholder
      .replace(
        /<h2[^>]*>.*?<\/h2>/,
        `<h2 style="margin:0; font-size:24px; color:#333;">${subject}</h2>`
      );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async RegisterPassword() {
    await this.send(
      "registerPassword",
      `Welcome ${this.userName}! Set Your Password`
    );
  }
};
