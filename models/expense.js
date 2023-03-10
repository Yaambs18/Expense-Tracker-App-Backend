const Sequelize = require("sequelize");
const sequilize = require("../util/database");

const Expense = sequilize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Expense;