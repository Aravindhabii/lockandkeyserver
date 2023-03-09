const mysql = require('mysql2')
// import mysql from 'mysql2'

db = mysql.createConnection({
  host: 'localhost',
  database: 'mydiary',
  password: 'root',
  user: 'root'
})

const connection = () => {
  db.connect((err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected to database')
    }
  })
}

module.exports.db = db
module.exports.connection = connection
