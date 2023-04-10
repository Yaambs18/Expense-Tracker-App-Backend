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
        const expenses = await Expense.find({'userId': req.user})
        
        res.json({
            expenses: expenses
        });
    }
    catch(err){
        console.log(err);
        res.sendStatus(500).json(err); 
    }
}

exports.addExpense = async (req, res, next) => {
    try {
        const expenseDesc = req.body.description;
        const expenseAmount = req.body.amount;
        const expenseCategory = req.body.category;
    
        if(isStringInvalid(expenseDesc) || isStringInvalid(expenseAmount) || isStringInvalid(expenseCategory)){
            return res.status(400).json({err : 'Bad Parameters: Something is missing'});
        }
        const expense = new Expense({
                            description: expenseDesc,
                            amount: expenseAmount,
                            category: expenseCategory,
                            userId: req.user
                        });
        const result = await expense.save();
        await User.findByIdAndUpdate(req.user._id,
          {
            totalExpenseAmount: Number(req.user.totalExpenseAmount) + Number(expenseAmount),
          }
        );
        res.json(result);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500).json(error); 
    }
        
}

exports.updateExpense = async (req, res, next) => {
    try {
        const user = req.user;

        const expenseId = req.params.expenseId;
        const updatedExpenseDesc = req.body.description;
        const updatedExpenseAmount = req.body.amount;
        const updatedExpenseCategory = req.body.category;
    
        const expense = await Expense.findById(expenseId);
        if(expense){
            expense.description = updatedExpenseDesc,
            expense.amount = updatedExpenseAmount,
            expense.category = updatedExpenseCategory
            const result = await expense.save();
            res.status(200).json({ success: true, result, message: 'Update Expense Successfully'});
        }else{
            res.status(404).json({ success: false, message: 'Not Found'});
        }
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500).json(err); 
    }
}

exports.deleteExpense = async (req, res, next) => {
    try{
        const user = req.user;

        const expenseId = req.params.expenseId;
        const expense = await Expense.findById(expenseId);
        if(expense){
            const deleted = await Expense.findByIdAndRemove(expenseId);
            if(deleted) {
                await User.findByIdAndUpdate(req.user, { totalExpenseAmount: Number(req.user.totalExpenseAmount) - Number(expense.amount) })
                res.status(200).json('Deleted Expense Succesfully');
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