const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 587,
    auth: {
      user: "hello@macworldproperties.com",
      pass: 'tUrbuz-gurwym-pepny3',
    },
  });
 const MailGun = async (params) => {
    console.log(params.email, params.message, params.firstName, params.lastName);
  try {
    await new Promise(async (resolve, reject) => {
      transporter.sendMail(
        {
          from: "hello@macworldproperties.com",
          to: `khanbahadur55555@gmail.com`,
          subject: "Macworld Logistics Quote Verification",
          html: '<h1>asadkhan21687352@gmail.com</h1> <br/> <h1>+971 552239077</h1>',
          text: "Test Email"
        },
        (error, info) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(info);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error occurred while uploading file:", error);
  }
};

module.exports = MailGun;
