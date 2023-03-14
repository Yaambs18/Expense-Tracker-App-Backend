const Expense = require('../models/expense');
const User = require('../models/user');
const sequilize = require('../util/database');

const getLeaderboard = async (req, res, next) => {
    const expenses = await Expense.findAll({
      attributes: ['id', "userId", [sequilize.fn('sum', sequilize.col('expense.amount')), 'total_cost']],
      include: {
        model: User,
        attributes: ["id", "name"],
      },
      group: ['expense.userId'],
      order: [['total_cost', 'DESC']]
    });
    console.log(expenses[0].user);
    res.json(expenses);
}

module.exports = {
    getLeaderboard
}