const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FilesDownloaded = sequelize.define('filesDowloaded', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    fileUrl: Sequelize.STRING
})

module.exports = FilesDownloaded;