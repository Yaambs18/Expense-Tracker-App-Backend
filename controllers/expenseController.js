const jwt = require('jsonwebtoken');

const Expense = require('../models/expense');
const User = require('../models/user');

function isStringInvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

exports.getExpenses = async (req, res, next) => {
    try{
        const user = req.user;

        const expenses = await Expense.findAll({ where: { userId: user.id }});
        res.json(expenses);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500).json(err); 
    }
}

exports.addExpense = async (req, res, next) => {
    try {
        const userToken = req.headers.authorization;
        const tokenData = jwt.verify(userToken, process.env.TOKEN_SECRET);

        const expenseDesc = req.body.description;
        const expenseAmount = req.body.amount;
        const expenseCategory = req.body.category;
    
        if(isStringInvalid(expenseDesc) || isStringInvalid(expenseAmount) || isStringInvalid(expenseCategory)){
            return res.status(400).json({err : 'Bad Parameters: Something is missing'});
        }
        const result = await Expense.create({
                            description: expenseDesc,
                            amount: expenseAmount,
                            category: expenseCategory,
                            userId: tokenData.userId
                        });
        const user = await User.findByPk(req.user.id)
        await User.update(
          {
            totalExpenseAmount: user.totalExpenseAmount + +expenseAmount,
          },
          { where: { id: req.user.id } }
        );
        res.json(result.dataValues);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500).json(error); 
    }
        
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

exports.deleteExpense = async (req, res, next) => {
    try{
        const userToken = req.headers.authorization;
        const tokenData = jwt.verify(userToken, secret);

        const expenseId = req.params.expenseId;
        const expense = await Expense.findByPk(expenseId, { where: { userID: tokenData.userId }});
        if(expense){
            const deleted = await expense.destroy();
            if(deleted) {
                res.status(200).json('Delted Expense Succesfully');
            }
        }
        else{
            res.status(404).json('Expense object not Found');
        }
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500).json(err); 
    }
}