const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const axios = require("axios")
const fs = require("fs"); 
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.REACT_APP_SQUARE_HOST,
    user: process.env.REACT_APP_SQUARE_USER,
    password: process.env.REACT_APP_SQUARE_PASSWORD,
    database: process.env.REACT_APP_SQUARE_DATABASE,
})

db.connect((err) => {
    if (err){
        console.error(`Database failed to connect: ${err}`)
        return
    }
    console.log("Connected to database")
})
const port = 3001
app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

app.post('/api/saveUserData/:userName' = async (req, res) => {
    try {
        const userName = req.params.userName
        const userData = req.body

        const filePath = `./data/${userName}.json`

        await fs.writeFile(filePath, JSON.stringify(userData))

        res.status(200).json({ message: "Data successfully stored"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error'})
    }
})
    
app.post('/api/getUserData/:userName' = async (req, res) => {
    try {
        const userName = req.params.userName
        const filePath = `./data/${userName}.json`

        const data = await fs.readFile(filePath, 'utf-8')
        const userData = JSON.parse(data)

        res.status(200).json(userData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error'})
    }
})

app.post('/api/authenticateUser/' = async (req, res) => {
    try {
        const { tryUsername, tryUserPassword } = req.body
        const sql = 'SELECT userName, password FROM userData WHERE userName = ? AND password = ?'
        console.log('attempted authentication', tryUsername, tryUserPassword)

        const [login] = await db.execute(sql, [tryUsername, tryUserPassword]);

        if (login.length > 0) {
            res.status(200).json({ message: 'Successfully logged in' });
        } else {
            res.status(404).json({ error: 'No userData found' });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error'})
    }
})

app.post('/api/registerUser/', async (req, res) => {
    try {
        const { newUsername, newUserPassword, newUserEmail } = req.body;
        const sql = 'SELECT userName, email FROM userData WHERE userName = ? OR email = ?';
        console.log('attempted registration checking for prior data', newUsername, newUserEmail);

        const [check] = await db.execute(sql, [newUsername, newUserEmail]);

        if (check.length > 0) {
            res.status(500).json({ message: 'Account Name or Email is already taken. Please choose a different one.' });
        } else {
            const sql2 = 'INSERT INTO userData (userName, password, email) VALUES (?,?,?)';
            await db.execute(sql2, [newUsername, newUserPassword, newUserEmail]);
            res.status(200).json({ message: 'Account successfully registered. Please log in now.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
