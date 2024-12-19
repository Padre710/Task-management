const { Sequelize } = require('sequelize');

username = process.env.DB_username
password = process.env.DB_password
database = process.env.DB_database
host = process.env.DB_host
dialect = process.env.DB_dialect

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    logging: true
  });


  module.exports = sequelize