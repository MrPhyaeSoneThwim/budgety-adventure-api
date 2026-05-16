const pug = require("pug");
const path = require("path");
const nodemailer = require("nodemailer");

module.exports = class EmailService {
  constructor(user) {
    this.to = user.email;
    this.from = `Noreply <${process.env.MAIL_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });
  }

  // Send the actual email
  async sendOTP(subject, otpCode) {
    const published = process.env.NODE_ENV === "production";

    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/otpTemplate.pug`, {
      otpCode,
      subject,
      published,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    if (published) {
      mailOptions.attachments = [
        {
          filename: "walelt.png",
          cid: "logo",
          path: path.join(__dirname, "../../public/img/wallet.png"),
        },
      ];
    }

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
};
