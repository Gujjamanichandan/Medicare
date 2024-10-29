const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Replace with your MySQL username
  password: '',  // Replace with your MySQL password
  database: 'medicare'   // Replace with your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

module.exports = db;
