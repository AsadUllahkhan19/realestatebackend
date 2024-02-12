const express = require("express");
const Property = require("../models/Property");
const mongoose = require('mongoose');
const router = express.Router();
const yup = require("yup");
const twilio = require("twilio");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");
const SavedProperties = require("../models/SaveProperty")
const User = require("../models/Users");
// =====================================
const nodemailer = require("nodemailer");
// require('dotenv').config();
// const mailgun = require('mailgun-js');
const { google } = require("googleapis");
const { errorMonitor } = require("nodemailer/lib/mailer");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  return transporter;
};

//create mail transported
const createMailTransporter = async () => {
  const apiKey = "77316142-6183407a";
    const domain = "sandbox799a3f485fd44f9081df7fa2756c2159.mailgun.org";

    const ClientId = "832524542097-m7kqvp5121159vsl3clpq6trbt4uk6gf.apps.googleusercontent.com";
    const ClientSecret = "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";

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
        console.log("yesss", err);
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
}

// Register Method Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, accountType } = req.body;
    // const schema = yup.object({
    //   name: yup
    //     .string()
    //     .required()
    //     .min(2, "Minimum length should be 2")
    //     .max(12, "Maximum length should be 12"),
    //   email: yup
    //     .string()
    //     .matches(
    //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //       "Invalid email format"
    //     )
    //     .required(),
    //   password: yup
    //     .string()
    //     .min(5, "Minimum length should be 5")
    //     .max(12, "Minimum length should be 12")
    //     .required(),
    //   phoneNumber: yup.string().min(6, "Invalid phone number").required(),
    //   accountType: yup.string().required(),
    // });
    // try {
    // await schema.validate({
    //   name: req?.body?.name,
    //   email: req?.body?.email,
    //   password: req?.body?.password,
    //   phoneNumber: req?.body?.phoneNumber,
    //   accountType: req?.body?.accountType,
    // });
    // } catch (error) {
    //   return res.status(400).json({ message: error["errors"][0] });
    // }
    // if (name == '' || name === null || name === undefined) {
    //     return res.send({ message: 'Name is required.' })
    // }
    // if (email == '' || email === null || email === undefined) {
    //     return res.send({ message: 'Email is required.' })
    // }
    // if (password == '' || password === null || password === undefined) {
    //     return res.send({ message: 'Password is required.' })
    // }
    // if (phoneNumber == '' || phoneNumber === null || phoneNumber === undefined) {
    //     return res.send({ message: 'Number is required.' })
    // }
    // if (accountType == '' || accountType === null || accountType === undefined) {
    //     return res.send({ message: 'Account is required.' })
    // }

    const checkEmail = await User.findOne({ email: email });

    if (checkEmail !== null) {
      return res.status(403).json({ message: "Email already exists." });
    }

    // 2. Hash password & Save to mongoose
    const hash = await bcrypt.hash(password, 10);

    // 3. generate OTP
    // Create a Twilio client
    // const client = new twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

    const OtpNumber = generateNewOTP();

    // 1. Add data to collection
    const saveData = new User({
      name: name,
      email: email,
      password: hash,
      phoneNumber: phoneNumber,
      accountType: accountType,
      otpCode: OtpNumber,
    });
    saveData.save();
    console.log(saveData)

    // ========================= NodeMailer ===================
    const apiKey = "77316142-6183407a";
    const domain = "sandbox799a3f485fd44f9081df7fa2756c2159.mailgun.org";

    

    const mailData = {
      subject: "MacWorld OTP Verification",
      text: `Your verification Otp is ${OtpNumber}`,
      to: req?.body?.email,
      from: 'macworldtechnology@gmail.com'
    }

    const transporter = await createMailTransporter();

    const server = await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (success) {
          resolve(success)
        }
        reject(error)
      })
    })
    if (!server) {
      res.status(500).json({ error: 'Error failed' })
    }

    const success = await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData).then((info, err) => {
        if (info.response.includes('250')) {
          resolve(true)
        }
        reject(err)
      })
    })

    if (!success) {
      res.status(500).json({ error: 'Error sending email' })
    }

    // ===========================================================

    // createTransporter()`
    //emailOptions - who sends what to whom
    // const sendEmail = async (emailOptions) => {
    //   let emailTransporter = await createTransporter();
    //   await emailTransporter.sendMail({
    //     subject: "MacWorld OTP Verification",
    //     text: `Your verification Otp is ${OtpNumber}`,
    //     to: req?.body?.email,
    //     from: 'macworldtechnology@gmail.com'
    //   });
    // };
    // sendEmail()
    // ========================================================


    return res.status(200).send({ message: "Success", data: saveData._id });
  } catch (error) {
    console.log("ERORR", error.name);
    return res.status(400).json({ message: error.name })
  }
});

router.post('/update-password', async (req, res) => {
  try {
    const { newPassword, password, id } = req.body;
    // 1. Get current password.
    if (newPassword == "" || newPassword === null || newPassword === undefined) {
      return res.status(400).send({ message: "New Password is required." });
    }
    if (password == "" || password === null || password === undefined) {
      return res.status(400).send({ message: "Password is required." });
    }
    const userData = await User.findOne({ _id: id });
    // 2. Match Password.
    const dbPassword = await bcrypt.compare(password, userData?.password);
    if (!dbPassword) {
      return res.status(400).send({ message: "Invalid password" });
    }

    // 2. Hash password & Save to mongoose
    const hash = await bcrypt.hash(newPassword, 10);
    // console.log("newwww", hash);
    // 3. IF password same
    const datas = await User.updateOne({ _id: id }, { $set: { password: hash } }, { new: true });
    //       Update Password
    //    ELSE  
    return res.status(200).json({ message: 'success', data: datas });
    //  RETURN Password Not Matched.
  } catch (error) {
    console.log('new Error', error);
    return res.send({ message: error.name });
  }
})

router.post('/edit-profile', async (req, res) => {
  try {
    const { name, email, id } = req.body;
    const userData = await User.findOne({ _id: id });
    if (userData?.name) {
      const datas = await User.updateOne({ _id: id }, { $set: { email: email, name: name } }, { new: true });
      return res.status(200).json({ message: 'success', data: datas })
    } else {
      return res.status(400).json({ message: `User doesn't exist` });
    }
  } catch (error) {
    console.log(error);
  }
})

// Verify Token
router.get("/verify-otp", async (req, res) => {
  try {
    const { otp, userId } = req.query;
    if (otp == "" || otp === null || otp === undefined) {
      return res.send({ message: "Otp is required." });
    }
    if (userId == "" || userId === null || userId === undefined) {
      return res.send({ message: "User Id is required." });
    }
    const schema = yup.object({
      otp: yup
        .string()
        .min(5)
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(5, "Must be exactly 5 digits")
        .max(5, "Must be exactly 5 digits"),
      userId: yup.string().required(),
    });
    try {
      await schema.validate({ otp, userId });
    } catch (error) {
      return res.json({ message: error["errors"][0] });
    }
    const data = await User.findOne({ _id: userId }).select("otpCode name email");

    if (data?.otpCode === otp) {
      const rs = await User.findOneAndUpdate(
        { _id: userId },
        { otpVerified: true }
      );

      // 2.0 encode
      let token1 = "";
      jwt.encode(process.env.SECRET, data?.email, function (err, token) {
        if (err) {
          console.error(err.name, err.message);
        } else {
          token1 = token;
        }
      });
      return res.send({ message: `${data?.name} your otp is verified`, data: token1 });
    }
    res.send({ message: "Invalid Otp" });
  } catch (error) {
    console.log("Error", error);
  }
});

// Login Method Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == "" || email === null || email === undefined) {
      return res.status(400).send({ message: "Email is required." });
    }
    if (password == "" || password === null || password === undefined) {
      return res.status(400).send({ message: "Password is required." });
    }
    // 1. Authenticate email & password.
    const userData = await User.findOne({ email: email });
    console.log(userData)
    if (userData?.otpVerified == false) {
      return res.status(400).send({ message: "Otp not verified." });
    }
    if (email != userData?.email) {
      return res.status(400).send({ message: "Invalid email" });
    }
    const dbPassword = await bcrypt.compare(password, userData?.password);
    if (!dbPassword) {
      return res.status(400).send({ message: "Invalid password" });
    }
    // 2. Generate jwt token.
    // var secret = 'TOPSECRETTTTT';

    // 2.0 encode
    let token1 = "";
    jwt.encode(process.env.SECRET, "asad@gmail.com", function (err, token) {
      if (err) {
        console.error(err.name, err.message);
      } else {
        token1 = token;
        console.log("tokenEncode", token);
      }
    });
    const { accountType, phoneNumber, name, _id } = userData;
    // 3. Return token and user Credentials.
    return res.send({
      message: "Successful",
      data: {
        token: token1,
        userData: { accountType, phoneNumber, name, _id, email },
      },
    });
  } catch (error) {
    console.log("ERORR", error);
  }
});

router.get('/user-save-property', (req, res) => {
  try {
    const { userId, propertyId } = req.query;


    
  } catch (error) {
    console.log('from_catch', error)
  }
})

router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    // console.log("Email", checkEmail);
    if (user == null) {
      return res.status(403).json({ message: "Email does not exist." });
    }

    // 2. Hash password & Save to mongoose
    // const hash = await bcrypt.hash(password, 10);
    
    const OtpNumber = generateNewOTP();
    
    // 1. Add data to collection
    const saveData = await User.updateOne({ _id: user.id }, { $set: { otpCode: OtpNumber, otpVerified: false } }, { new: true });
    
    console.log("OTP value updated");

    const transporter = await createMailTransporter();

    const mailData = {
      subject: "MacWorld OTP Verification",
      text: `Your verification Otp is ${OtpNumber}`,
      to: email,
      from: 'macworldtechnology@gmail.com'
    }
    
    const server = await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (success) {
          resolve(success)
        }
        reject(error)
      });
    })
    if (!server) {
      res.status(500).json({ error: 'Error failed' })
    }

    const success = await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData).then((info, err) => {
        if (info.response.includes('250')) {
          resolve(true)
        }
        reject(err)
      })
    });

    if (!success) {
      res.status(500).json({ error: 'Error sending email' })
    }

    return res.status(200).send({ message: "Success", data: user.id });
  } catch (error) {
    console.log("Error", error);
  }
});

router.put('/reset-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    // console.log("Request received", userId, newPassword);
    if (newPassword == "" || newPassword === null || newPassword === undefined) {
      return res.status(400).send({ message: "New Password is required." });
    }
    if (userId == "" || userId === null || userId === undefined) {
      return res.status(400).send({ message: "userId is required." });
    }
    const userData = await User.findOne({ _id: userId });

    if (!userData) {
      return res.status(400).json({ message: 'userId is not a valid user.', data: datas });
    }

    // 2. Hash password & Save to mongoose
    const hash = await bcrypt.hash(newPassword, 10);
    // console.log("newwww", hash);
    // 3. IF password same
    const datas = await User.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });
    //       Update Password
    //    ELSE  

    return res.status(200).json({ message: 'success', data: datas });
  } catch (error) {
    console.log('Error reset password', error);
  }
});

router.post("/save-property/:userId/:propertyId", async (req, res) => {
	try{
		console.log(SavedProperties)
		let userId = req.params.userId
		let propertyId = req.params.propertyId
		const newSavedProperty = new SavedProperties({
			userId,
			propertyId
		})
		const result = await newSavedProperty.save()
		res.json({
			result,
			message:"success"
		}).
		status(200).
		end()
	}catch(err){
		console.log(err)
	}
})
router.delete("/delete-save-property/:id", async (req, res) => {
	try{
		const ObjectId = mongoose.Types.ObjectId;
		const result = await SavedProperties.deleteOne({
			_id :new ObjectId(req.params.id)
		})
		res.json({
			result,
			message:"success"
		}).
		status(200).
		end()
	}catch(err){
		console.log(err)
	}
})

router.get("/get-one-save-property/:userId/:propertyId", async (req, res) => {
	try{
		let userId = req.params.userId
		let propertyId = req.params.propertyId
		const result = await SavedProperties.findOne({
			userId: userId,
			propertyId
		})
		res.json({
			result,
			message:"success"
		}).
		status(200).
		end()
	}catch(err){
		console.log(err)
	}
})
router.get("/get-save-property/:userId", async (req, res) => {
	try{
		let userId = req.params.userId
		const result = await SavedProperties.aggregate([
  {
    $match: { userId: userId }
  },
  {
    $project: { propertyId: 1, _id: 0 }
  },
]);	

		const ObjectId = mongoose.Types.ObjectId;
		const isValidId = mongoose.Types.ObjectId.isValid;
		console.log(result)
		let arr = result.map((obj) =>{
			if (isValidId(obj?.propertyId)){
			return	new ObjectId(obj?.propertyId)
			}
		})
		const properties = await  Property.find({
			_id :{
				$in: arr
			}
		})
		res.json({
			properties,
			message:"success"
		}).
		status(200).
		end()
	}catch(err){
		console.log(err)
	}
})
// router.get("/", (req, res) => {
//   // const client = new twilio(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
//   client.messages
//     .create({
//       body: `Mac World Otp Varification Code is ${"asad"}.`,
//       from: "+17622525559",
//       to: "+923149856502",
//     })
//     .then((message) => console.log(`Message SID: ${message.sid}`))
//     .catch((error) => console.error("Anas bhai", error));
// });

const generateNewOTP = () => {
  
  const minm = 10000;
  const maxm = 99999;
  const OtpNumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;

  return OtpNumber;
}

module.exports = router;
