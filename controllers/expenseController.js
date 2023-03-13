const jwt = require('jsonwebtoken');

const Expense = require('../models/expense');

const secret = '5d5328271da7ff5830fe552588dad34b1ac3748e1432f079372149c8d55c5d5dcb65d5e0245598443ff7e1aabd2947dd4a1da70440d08f1d99137aed14b58d93';

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
        const userToken = req.headers.authorization;
        const tokenData = jwt.verify(userToken, secret);

        const expenses = await Expense.findAll({ where: { userId: tokenData.userId }});
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
        const tokenData = jwt.verify(userToken, secret);

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
        res.json(result.dataValues);
    }
    catch(error){
        console.log(err);
        res.sendStatus(500).json(err); 
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