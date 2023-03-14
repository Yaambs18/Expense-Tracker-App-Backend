const express = require('express');

const premiumController = require('../controllers/premiumFeature');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', authenticatemiddleware.authenticate, premiumController.getLeaderboard);

module.exports = router;