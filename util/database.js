const Sequelize = require('sequelize');

const sequilize = new Sequelize(process.env.DATABASE_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST
})

module.exports = sequilize;