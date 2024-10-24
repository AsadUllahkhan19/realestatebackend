const nodemailer = require("nodemailer");
require("dotenv").config();



const transporter = nodemailer.createTransport({
  host: process.env.Ehost,
  port: process.env.Eport,
  auth: {
    user: "support@macworldproperties.com",
    pass: process.env.Epassword,
  },
});

const MailGun = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  try {
    await transporter.sendMail({
      from: "support@macworldproperties.com",
      to: "hello@macworldproperties.com",
      subject: "A User Wants To Contact",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; text-align: center;">Contact Information</h2>
          <hr style="border: 1px solid #ccc;">
          <p style="font-size: 16px; color: #555; margin: 10px 0;"><strong>First Name:</strong> ${firstName}</p>
          <p style="font-size: 16px; color: #555; margin: 10px 0;"><strong>Last Name:</strong> ${lastName}</p>
          <p style="font-size: 16px; color: #555; margin: 10px 0;"><strong>Sender Email:</strong> ${email}</p>
          <p style="font-size: 16px; color: #555; margin: 10px 0;"><strong>Sender Phone Number:</strong> ${phoneNumber}</p>
          <p style="font-size: 16px; color: #555; margin: 10px 0;"><strong>Message:</strong></p>
          <p style="line-height: 1.5; color: #555; margin: 10px 0;">${message}</p>
        </div>
      `,
      // text: "Test Email"
    });

    res.status(200).send({message:"User Contact Sent to Admin"});
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    res.status(500).send({ error: "Failed to send email. Please try again later." });
  }
};

module.exports = MailGun;
