const express = require('express');

const router = express.Router();

const forgotpasswordController = require('../controllers/forgotPassword');

router.post('/forgotpassword', forgotpasswordController.sendResetPasswordEmail);

module.exports = router;