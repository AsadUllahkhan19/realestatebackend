const express = require("express");
const router = express.Router();

router.use('/property', require('./property'));
router.use('/lov', require('./lov'));
router.use('/users', require('./users'));

module.exports = router;