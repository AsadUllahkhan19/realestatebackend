const express = require("express");
const MailGun = require("../helpers/ContactUs");
const router = express.Router();
const path = require("path")


router.use('/lov', require('./lov'));
router.use('/users', require('./users'));
router.use('/property', require('./property'));
router.use("/privacy-policy",(req,res)=>res.sendFile(`${path.join(__dirname,"../helpers/privacypolicy.html")}`))
router.use("/cookies-policy",(req,res)=>res.sendFile(`${path.join(__dirname,"../helpers/cookiespolicy.html")}`))
router.use("/terms-conditions",(req,res)=>res.sendFile(`${path.join(__dirname,"../helpers/termsandcondition.html")}`))
router.post("/contactUs",MailGun)

module.exports = router;