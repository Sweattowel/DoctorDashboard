// Seperate the Database into const for reference in routes

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
});


console.log(
	process.env.DATABASE_HOST,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	process.env.DATABASE_DATABASE
);

module.exports = db;