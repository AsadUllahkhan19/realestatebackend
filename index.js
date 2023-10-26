const express = require("express");
const app = express();
const cors = require("cors");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
// const multer = require("multer");

const main = require("./config/db");
// const UserMiddleWare = require("./middlewares/UserVerify");
// const helpers = require("./helpers/validation");

// Your Twilio Account SID and Auth Token

app.use(cors("*"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Fine");
});
// app.use(
//   "/static",
//   express.static(path.join(__dirname, "public", "data", "uploads"))
// );

main();

app.use("/", require("./routes/index"));

// Testing API

app.listen(4000, () => console.log("Server running 4000"));

// jwt.encode(secret, 'asad@gmail.com', function (err, token) {
//     if (err) {
//       console.error(err.name, err.message);
//     } else {
//       console.log('tokenEncode', token);

//       // decode
//       jwt.decode(secret, token, function (err_, decodedPayload, decodedHeader) {
//         if (err) {
//           console.error(err.name, err.message);
//         } else {
//           console.log('tokenDecode', decodedPayload, decodedHeader);
//         }
//       });
//     }
//   });
