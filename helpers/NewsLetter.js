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

const NewsLetterMail = async (email) => {
//   const { firstName, lastName, email, phoneNumber, message } = req.body;

//   try {
    return await transporter.sendMail({
      from: "support@macworldproperties.com",
      to: email,
      subject: "Macworld Properties Newletter Subscription.",
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You Have Subscribed To MacWorld Properties</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #888;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Company Name</h1>
        </div>
        <div class="content">
            <h2>Hello, ${email}!</h2>
            <p>You Have Subscribed To MacWorld Properties Newsletter.</p>
            <p>Thank you for choosing our services. We are excited to have you on board.</p>
            <p>If you have any questions, feel free to reach out to us.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
            <p><a href="https://www.macworldproperties.com">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
      `,
      // text: "Test Email"
    });

    // res.status(200).send({ message: "User Contact Sent to Admin" });
//   } catch (error) {
//     console.error("Error occurred while sending email:", error);
//     res
//       .status(500)
//       .send({ error: "Failed to send email. Please try again later." });
//   }
};

module.exports = NewsLetterMail;
