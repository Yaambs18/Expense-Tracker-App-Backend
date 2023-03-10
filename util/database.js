const Sequelize = require('sequelize');

const sequilize = new Sequelize('expense-tracker-db', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequilize;