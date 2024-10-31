const express = require("express");
const app = express();
const cors = require("cors");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
// const multer = require("multer");
// const swaggerUi = require('swagger-ui-express');
const main = require("./config/db");

// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const UserMiddleWare = require("./middlewares/UserVerify");
// const helpers = require("./helpers/validation");
// const options = {
//   definition: {
//     openapi: "3.1.0",
//     info: {
//       title: "LogRocket Express API with Swagger",
//       version: "0.1.0",
//       description:
//         "This is a simple CRUD API application made with Express and documented with Swagger",
//       license: {
//         name: "MIT",
//         url: "https://spdx.org/licenses/MIT.html",
//       },
//       contact: {
//         name: "LogRocket",
//         url: "https://logrocket.com",
//         email: "info@email.com",
//       },
//     },
//     servers: [
//       {
//         url: "http://localhost:4000",
//         url: "https://realestatebackend-woad.vercel.app"
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };
// const specs = swaggerJsdoc(options);
// Your Twilio Account SID and Auth Token

app.use(cors('*'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(specs,{ explorer: true })
// );
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// app.use(
//   "/static",
//   express.static(path.join(__dirname, "files", "data", "uploads"))
// );

main();

app.get("/", (req, res) => {
  res.send("Fine");
});


app.use("/", require("./routes/index"));

// Testing API

app.listen(process.env.PORT, () => console.log("Server running 8000"));

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
