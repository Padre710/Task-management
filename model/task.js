const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conf');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('To-Do', 'In Progress', 'Completed'),
        defaultValue: 'To-Do',
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Task;
