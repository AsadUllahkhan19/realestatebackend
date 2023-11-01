const nodemailer = require("nodemailer");
// require('dotenv').config();
// const mailgun = require('mailgun-js');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const apiKey = "77316142-6183407a";
const domain = "sandbox799a3f485fd44f9081df7fa2756c2159.mailgun.org";

const ClientId =
  "832524542097-m7kqvp5121159vsl3clpq6trbt4uk6gf.apps.googleusercontent.com";
const ClientSecret = "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";


const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    ClientId,
    ClientSecret,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token:
      "1//04tNKOIERQqAECgYIARAAGAQSNwF-L9Ir5Tr66fdik3S_af1088-5xIzBrnbL-QVCfgNz6EoazeZUqENCctlcm6WvaM7A81NHH1U",
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log("yyyyyyyyy", err);
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "khanbahadur55555@gmail.com",
      accessToken,
      clientId:
        "832524542097-m7kqvp5121159vsl3clpq6trbt4uk6gf.apps.googleusercontent.com",
      clientSecret:
        "832524542097-m7kqvp5121159vsl3clpq6trbt4uk6gf.apps.googleusercontent.com",
      refreshToken:
        "1//04tNKOIERQqAECgYIARAAGAQSNwF-L9Ir5Tr66fdik3S_af1088-5xIzBrnbL-QVCfgNz6EoazeZUqENCctlcm6WvaM7A81NHH1U",
    },
  });

  return transporter;
};

// createTransporter()`
//emailOptions - who sends what to whom
const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

// ====================================================================================================

module.exports = sendEmail;
