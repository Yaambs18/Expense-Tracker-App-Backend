const jwt = require('jsonwebtoken');

const Expense = require('../models/expense');
const sequilize = require('../util/database');

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
        const ITEMS_PER_PAGE = Number(req.query.size) || 10;
        const user = req.user;

        const page = Number(req.query.page) || 1;
        const totalCount = await Expense.count();
        const expenses = await user.getExpenses({
            offset: (page -1 ) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });
        
        res.json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalCount,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalCount/ITEMS_PER_PAGE)
        });
    }
    catch(err){
        console.log(err);
        res.sendStatus(500).json(err); 
    }
}

exports.addExpense = async (req, res, next) => {
    const transaction = await sequilize.transaction();
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
                        }, {transaction: transaction});
        await req.user.update(
          {
            totalExpenseAmount: Number(req.user.totalExpenseAmount) + Number(expenseAmount),
          },
          { where: { id: req.user.id }, transaction: transaction }
        );
        await transaction.commit();
        res.json(result.dataValues);
    }
    catch(error){
        await transaction.rollback();
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
    const transaction = await sequilize.transaction();
    try{
        const user = req.user;

        const expenseId = req.params.expenseId;
        const expense = await Expense.findByPk(expenseId, { where: { userID: user.id }});
        if(expense){
            const deleted = await expense.destroy({transaction: transaction});
            if(deleted) {
                await req.user.update( { totalExpenseAmount: Number(req.user.totalExpenseAmount) - Number(expense.amount) },{transaction: transaction})
                await transaction.commit();
                res.status(200).json('Deleted Expense Succesfully');
            }
        }
        else{
            res.status(404).json('Expense object not Found');
        }
    }
    catch(err) {
        await transaction.rollback();
        console.log(err);
        res.sendStatus(500).json(err); 
    }
}