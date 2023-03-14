const Expense = require('../models/expense');
const User = require('../models/user');
const sequilize = require('../util/database');

const getLeaderboard = async (req, res, next) => {
    requestUser = await User.findByPk(req.user.id);
    if(!requestUser.ispremiumuser){
        res.status(403).json({message: 'You are not a premium user'});
    }
    const expenses = await User.findAll({
      attributes: ['id', "name", 'totalExpenseAmount'],
      order: [['totalExpenseAmount', 'DESC']]
    });
    console.log(expenses[0].user);
    res.json(expenses);
}

module.exports = {
    getLeaderboard
}