import { MysqlError } from "mysql";

import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql';

const app = express();


const db = mysql.createConnection({
    host: process.env.REACT_APP_SQUARE_HOST as string,
    user: process.env.REACT_APP_SQUARE_USER as string,
    password: process.env.REACT_APP_SQUARE_PASSWORD as string,
    database: process.env.REACT_APP_SQUARE_DATABASE as string,
})

db.connect((err: MysqlError) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connected to database')
})
const port = 3001;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

app.post('/api/CREATEDATA', (req: Request, res: Response) => {
    try {
        const createDoctorTable = `
            CREATE TABLE IF NOT EXISTS Doctors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                Speciality VARCHAR(255),
                phone VARCHAR(20),
                email VARCHAR(255),
                address TEXT,
                yearsOfExperience INT,
                hospitalAffiliation VARCHAR(255)
            );
        `;
        
        const fillDoctorTable = `
            INSERT INTO Doctors (name, Speciality, phone, email, address, yearsOfExperience, hospitalAffiliation)
            VALUES 
                ('Dr. Smith', 'Dermatologist', '+1-234-567-8901', 'dr.smith@example.com', '123 Skin Care Rd, Dermaville, SK 12345', 15, 'Skin Health Clinic'),
                ('Dr. Patel', 'Neurologist', '+1-234-567-8902', 'dr.patel@example.com', '456 Brainy St, Neurocity, NE 23456', 10, 'NeuroHealth Center'),
                ('Dr. Garcia', 'Pediatrician', '+1-234-567-8903', 'dr.garcia@example.com', '789 Kids Lane, Pediatricville, PD 34567', 8, 'Pediatrics Plus');
        `;
        
        const createAppointmentTable = `
            CREATE TABLE IF NOT EXISTS Appointments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                DoctorID INT,
                Title VARCHAR(10),
                ClientName VARCHAR(255),
                Occupation VARCHAR(255),
                Address TEXT,
                Phone VARCHAR(20),
                Email VARCHAR(255),
                AppointmentDate DATETIME,
                Result VARCHAR(50),
                FurtherAction BOOLEAN,
                LOA INT,
                ClientStatus VARCHAR(100),
                Issue TEXT,
                FOREIGN KEY (DoctorID) REFERENCES Doctors(id) ON DELETE CASCADE
            );
        `;
        
        const fillAppointmentTable = `
            INSERT INTO Appointments 
                (DoctorID, Title, ClientName, Occupation, Address, Phone, Email, AppointmentDate, Result, FurtherAction, LOA, ClientStatus, Issue)
            VALUES
                (1, 'Mrs', 'Alicia Smith', 'Nurse', '123 Example Way', '000-000-000', 'TestEmail12@34.com', '2024-09-15 10:00:00', 'N/A', false, 1, 'Healthy', 'General Checkup'),
                (1, 'Mr', 'Robert Brown', 'Teacher', '456 Sample Road', '111-111-111', 'robert.brown@email.com', '2024-09-16 11:00:00', 'Pending', true, 2, 'Needs Follow-Up', 'Blood Pressure'),
                (1, 'Ms', 'Emily Davis', 'Engineer', '789 Test Avenue', '222-222-222', 'emily.davis@email.com', '2024-09-17 14:00:00', 'Completed', false, 0, 'Healthy', 'Routine Checkup'),
                (1, 'Mr', 'Michael Wilson', 'Lawyer', '101 Data Street', '333-333-333', 'michael.wilson@email.com', '2024-09-18 09:00:00', 'Completed', false, 0, 'Healthy', 'Routine Examination'),
                (1, 'Ms', 'Sarah Moore', 'Artist', '202 Example Blvd', '444-444-444', 'sarah.moore@email.com', '2024-09-19 15:00:00', 'Completed', false, 0, 'Healthy', 'Health Review');
        `;
        
        // Execute queries
        db.query(createDoctorTable, (err: any) => {
            if (err) throw err;
            db.query(fillDoctorTable, (err: any) => {
                if (err) throw err;
                db.query(createAppointmentTable, (err: any) => {
                    if (err) throw err;
                    db.query(fillAppointmentTable, (err: any) => {
                        if (err) throw err;
                        res.status(200).json({ message: "Tables created and data inserted successfully" });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/api/getDoctors', (req: Request, res: Response) => {
    try {
        const SQL = `SELECT * FROM Doctors 
                     LEFT JOIN Appointments 
                     ON Doctors.ID = Appointments.DoctorID`;

        db.query(SQL, (err: MysqlError | null, results: any) => {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }

            res.status(200).json({ data: results });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/getDoctorNames', (req: Request, res: Response) => {
    try {
        const SQL = `SELECT name FROM Doctors`;

        db.query(SQL, (err: MysqlError | null, results: any) => {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }

            res.status(200).json({ data: results });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

