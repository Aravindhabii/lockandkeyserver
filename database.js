const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
// import mysql from 'mysql2'

db = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  database: process.env.MYSQL_ADDON_DB,
  password: process.env.MYSQL_ADDON_PASSWORD,
  user: process.env.MYSQL_ADDON_USER,
  port: process.env.MYSQL_ADDON_PORT,
});

//poda
const connection = () => {
  db.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to database");
    }
  });
};

module.exports.db = db;
module.exports.connection = connection;
