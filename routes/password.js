const express = require('express');

const router = express.Router();

const forgotpasswordController = require('../controllers/forgotPassword');

router.post('/forgotpassword', forgotpasswordController.sendResetPasswordEmail);

router.get('/resetpassword/:resetId', forgotpasswordController.resetPassword);

router.get('/updatePassword/:resetId', forgotpasswordController.updatePassword);

module.exports = router;