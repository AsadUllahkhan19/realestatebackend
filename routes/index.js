const express = require("express");
const MailGun = require("../helpers/ContactUs");
const router = express.Router();


router.use('/lov', require('./lov'));
router.use('/users', require('./users'));
router.use('/property', require('./property'));
router.post("/contactUs",MailGun)

module.exports = router;