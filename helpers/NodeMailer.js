const nodemailer = require("nodemailer");
// require('dotenv').config();
// const mailgun = require('mailgun-js');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

// Replace with your Mailgun API key and domain
const apiKey = "77316142-6183407a";
const domain = "sandbox799a3f485fd44f9081df7fa2756c2159.mailgun.org";

const ClientId =
  "832524542097-m7kqvp5121159vsl3clpq6trbt4uk6gf.apps.googleusercontent.com";
const ClientSecret = "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";

// {
//     "access_token": "ya29.a0AfB_byARI1l1H9VyvT-mQ1AP7kQwxUZqwlfejnhNkqMgdP2PVG_2LU4Lt7nrAZ8MyjF7pAOQ0wxhqddREdXf_g695nCHjSyYpqXwvUjcuBsNraOdhJMi8Uc7YgVWAKMB1vxz3PnWajjOtXCIhqB9izmpmMf7wjCwMzE9aCgYKARwSARISFQGOcNnCzDj5bToT9O-21oUxn6e9RA0171",
//     "scope": "https://mail.google.com/",
//     "token_type": "Bearer",
//     "expires_in": 3599,
//     "refresh_token": "1//04tNKOIERQqAECgYIARAAGAQSNwF-L9Ir5Tr66fdik3S_af1088-5xIzBrnbL-QVCfgNz6EoazeZUqENCctlcm6WvaM7A81NHH1U"
//   }

// Initialize the Mailgun instance
// const mg = mailgun({ apiKey, domain, host: "api.eu.mailgun.net" });

// const handleEmailOtp = (otpCode) => {
//     const transporter = nodemailer.createTransport({
//         auth: {
//             user: 'natasha.gislason@ethereal.email',
//             pass: 'uH6thtBNCD7sAt6ahH'
//         }
//     });

//     const mailOptions = {
//         from: process.env.EMAILFORMAIL,
//         to: 'myfriend@yahoo.com',
//         subject: 'Otp from Mac World',
//         text: `Your verification otp is ${otpCode}`
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

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
