const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    orderId: Sequelize.STRING,
    paymentId: Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = Order;