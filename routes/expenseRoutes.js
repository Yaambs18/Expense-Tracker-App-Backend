const express = require('express');

const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.get('/', expenseController.getExpenses);

router.post('/addExpense', expenseController.addExpense);

router.put('/:expenseId', expenseController.updateExpense);

router.delete('/:expenseId', expenseController.deleteExpense);

module.exports = router;