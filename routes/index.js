const express = require("express");
const router = express.Router();


router.use('/lov', require('./lov'));
router.use('/users', require('./users'));
router.use('/property', require('./property'));

module.exports = router;