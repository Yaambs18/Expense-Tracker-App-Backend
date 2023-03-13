const Expense = require('../models/expense');

exports.getExpenses = (req, res, next) => {
    Expense.findAll()
      .then((expenses) => {
        res.json(expenses);
      })
      .catch((err) => console.log(err));
}

exports.addExpense = (req, res, next) => {
    const expenseDesc = req.body.description;
    const expenseAmount = req.body.amount;
    const expenseCategory = req.body.category;
    
    Expense.create({
        description: expenseDesc,
        amount: expenseAmount,
        category: expenseCategory
    })
    .then(result => {
        res.json(result.dataValues);
    })
    .catch(err => console.log(err));
}

exports.updateExpense = (req, res, next) => {
    const expenseId = req.params.expenseId;
    const updatedExpenseDesc = req.body.description;
    const updatedExpenseAmount = req.body.amount;
    const updatedExpenseCategory = req.body.category;

    Expense.findByPk(expenseId)
    .then(expense => {
        expense.description = updatedExpenseDesc,
        expense.amount = updatedExpenseAmount,
        expense.category = updatedExpenseCategory
        return expense.save();
    })
    .then(result => {
        res.json(result);
    })
    .catch(err => console.log(err));
}

exports.deleteExpense = (req, res, next) => {
    const expenseId = req.params.expenseId;
    Expense.findByPk(expenseId)
    .then(expense => {
        return expense.destroy();
    })
    .then(result => {
        res.json('');
    })
    .catch(err => console.log(err));
}