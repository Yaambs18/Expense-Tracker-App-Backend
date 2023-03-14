const express = require('express');

const expenseController = require('../controllers/expenseController');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticatemiddleware.authenticate, expenseController.getExpenses);

router.post('/addExpense', authenticatemiddleware.authenticate, expenseController.addExpense);

router.put('/:expenseId', authenticatemiddleware.authenticate, expenseController.updateExpense);

router.delete('/:expenseId', authenticatemiddleware.authenticate, expenseController.deleteExpense);

module.exports = router;