const User = require('../models/user');

const getLeaderboard = async (req, res, next) => {
    requestUser = req.user;
    if(!requestUser.ispremiumuser){
        res.status(403).json({message: 'You are not a premium user'});
    }
    const expenses = await User.find().select('id name totalExpenseAmount');
    res.json(expenses);
}

module.exports = {
    getLeaderboard
}