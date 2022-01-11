const pug = require("pug");
const path = require("path");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const OAuth2 = google.auth.OAuth2;

module.exports = class EmailService {
  constructor(user) {
    this.to = user.email;
    this.from = `Noreply <${process.env.MAIL_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.OAUTH_PLAYGORUND
      );

      oauth2Client.setCredentials({
        forceRefreshOnFailure: true,
        refresh_token: process.env.REFRESH_TOKEN,
      });

      const accessToken = oauth2Client.getAccessToken();

      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USERNAME,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
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
