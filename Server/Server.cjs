"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var mysql2 = require("mysql2");
var app = express();

var dotenv = require("dotenv");
dotenv.config({ path: "Server\.env"});
console.log(    
    process.env.REACT_APP_SQUARE_HOST,
    process.env.REACT_APP_SQUARE_USER,
    process.env.REACT_APP_SQUARE_PASSWORD,
    process.env.REACT_APP_SQUARE_DATABASE
)
// DB Create connectionString;
var db = mysql2.createConnection({
    host: process.env.REACT_APP_SQUARE_HOST,
    user: process.env.REACT_APP_SQUARE_USER,
    password: process.env.REACT_APP_SQUARE_PASSWORD,
    database: process.env.REACT_APP_SQUARE_DATABASE,
});
// Handle create local connection to DB
db.connect(function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connected to database');
});
// Define App Port and use libaries
var port = 3001;
app.use((0, cors)());
app.use(express.json());

// Listen for oncoming requests to the server
app.listen(port, function () {
    console.log("Server is listening on port ".concat(port));
});

app.post('/api/CREATEDATA', function (req, res) {
    try {
        var createDoctorTable = "\n            CREATE TABLE IF NOT EXISTS Doctors (\n                id INT PRIMARY KEY AUTO_INCREMENT,\n                name VARCHAR(255) NOT NULL,\n                Speciality VARCHAR(255),\n                phone VARCHAR(20),\n                email VARCHAR(255),\n                address TEXT,\n                yearsOfExperience INT,\n                hospitalAffiliation VARCHAR(255)\n            );\n        ";
        var fillDoctorTable = "\n            INSERT INTO Doctors (name, Speciality, phone, email, address, yearsOfExperience, hospitalAffiliation)\n            VALUES \n                ('Dr. Smith', 'Dermatologist', '+1-234-567-8901', 'dr.smith@example.com', '123 Skin Care Rd, Dermaville, SK 12345', 15, 'Skin Health Clinic'),\n                ('Dr. Patel', 'Neurologist', '+1-234-567-8902', 'dr.patel@example.com', '456 Brainy St, Neurocity, NE 23456', 10, 'NeuroHealth Center'),\n                ('Dr. Garcia', 'Pediatrician', '+1-234-567-8903', 'dr.garcia@example.com', '789 Kids Lane, Pediatricville, PD 34567', 8, 'Pediatrics Plus');\n        ";
        var createAppointmentTable = "\n            CREATE TABLE IF NOT EXISTS Appointments (\n                id INT PRIMARY KEY AUTO_INCREMENT,\n                DoctorID INT,\n                Title VARCHAR(10),\n                ClientName VARCHAR(255),\n                Occupation VARCHAR(255),\n                Address TEXT,\n                Phone VARCHAR(20),\n                Email VARCHAR(255),\n                AppointmentDate DATETIME,\n                Result VARCHAR(50),\n                FurtherAction BOOLEAN,\n                LOA INT,\n                ClientStatus VARCHAR(100),\n                Issue TEXT,\n                FOREIGN KEY (DoctorID) REFERENCES Doctors(id) ON DELETE CASCADE\n            );\n        ";
        var fillAppointmentTable = "\n            INSERT INTO Appointments \n                (DoctorID, Title, ClientName, Occupation, Address, Phone, Email, AppointmentDate, Result, FurtherAction, LOA, ClientStatus, Issue)\n            VALUES\n                (1, 'Mrs', 'Alicia Smith', 'Nurse', '123 Example Way', '000-000-000', 'TestEmail12@34.com', '2024-09-15 10:00:00', 'N/A', false, 1, 'Healthy', 'General Checkup'),\n                (1, 'Mr', 'Robert Brown', 'Teacher', '456 Sample Road', '111-111-111', 'robert.brown@email.com', '2024-09-16 11:00:00', 'Pending', true, 2, 'Needs Follow-Up', 'Blood Pressure'),\n                (1, 'Ms', 'Emily Davis', 'Engineer', '789 Test Avenue', '222-222-222', 'emily.davis@email.com', '2024-09-17 14:00:00', 'Completed', false, 0, 'Healthy', 'Routine Checkup'),\n                (1, 'Mr', 'Michael Wilson', 'Lawyer', '101 Data Street', '333-333-333', 'michael.wilson@email.com', '2024-09-18 09:00:00', 'Completed', false, 0, 'Healthy', 'Routine Examination'),\n                (1, 'Ms', 'Sarah Moore', 'Artist', '202 Example Blvd', '444-444-444', 'sarah.moore@email.com', '2024-09-19 15:00:00', 'Completed', false, 0, 'Healthy', 'Health Review');\n        ";
        // Execute queries
        db.query(createDoctorTable, function (err) {
            if (err)
                throw err;
            db.query(fillDoctorTable, function (err) {
                if (err)
                    throw err;
                db.query(createAppointmentTable, function (err) {
                    if (err)
                        throw err;
                    db.query(fillAppointmentTable, function (err) {
                        if (err)
                            throw err;
                        res.status(200).json({ message: "Tables created and data inserted successfully" });
                    });
                });
            });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/getDoctors', function (req, res) {
    try {
        var SQL = "SELECT * FROM Doctors \n                     LEFT JOIN Appointments \n                     ON Doctors.ID = Appointments.DoctorID";
        db.query(SQL, function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }
            res.status(200).json({ data: results });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/getDoctorNames', function (req, res) {
    try {
        var SQL = "SELECT name FROM Doctors";
        db.query(SQL, function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }
            res.status(200).json({ data: results });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
