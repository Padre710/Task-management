const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conf');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Comment;
