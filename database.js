const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();
// import mysql from 'mysql2'

db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  database: process.env.MYSQLDATABASE,
  password: process.env.MYSQLPASSWORD,
  user: process.env.MYSQLUSER,
  port: process.env.MYSQLPORT,
});

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
