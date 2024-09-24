// Helper Functions
const { HASH, COMPARE } = require("./Handlers/EncryptionHandle.cjs");
const { CreateToken, VerifyToken, RefreshToken } = require("./Handlers/TokenHandle.cjs");
// CORE functions
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const https = require("https");
const fs = require("fs"); 
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const privateKey = fs.readFileSync(`Certificates/${process.env.SERVER_ADDRESS}-key.pem`, 'utf8');
const certificate = fs.readFileSync(`Certificates/${process.env.SERVER_ADDRESS}.pem`, 'utf8');

const credentials = { key: privateKey, cert: certificate };

const { error } = require("console");
 


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
})

console.log(    
    process.env.DATABASE_HOST,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    process.env.DATABASE_DATABASE
)

db.connect((err) => {
    if (err){
        console.error(`Database failed to connect: ${err}`)
        return
    }
    console.log("Connected to database")
})

const port = 3001
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials :true
  };
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

const httpServer = https.createServer(credentials, app);

httpServer.listen(port, process.env.SERVER_ADDRESS, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get('/api/CREATEDATA', function (req, res) {
    try {
        console.log("Creating Server Data");

        let createDoctorTable = "\n            CREATE TABLE IF NOT EXISTS Doctors (\n                id INT PRIMARY KEY AUTO_INCREMENT,\n                name VARCHAR(255) NOT NULL,\n                Speciality VARCHAR(255),\n                phone VARCHAR(20),\n                email VARCHAR(255),\n                address TEXT,\n                yearsOfExperience INT,\n                hospitalAffiliation VARCHAR(255)\n            );\n        ";
        let fillDoctorTable = "\n            INSERT INTO Doctors (name, Speciality, phone, email, address, yearsOfExperience, hospitalAffiliation)\n            VALUES \n                ('Dr. Smith', 'Dermatologist', '+1-234-567-8901', 'dr.smith@example.com', '123 Skin Care Rd, Dermaville, SK 12345', 15, 'Skin Health Clinic'),\n                ('Dr. Patel', 'Neurologist', '+1-234-567-8902', 'dr.patel@example.com', '456 Brainy St, Neurocity, NE 23456', 10, 'NeuroHealth Center'),\n                ('Dr. Garcia', 'Pediatrician', '+1-234-567-8903', 'dr.garcia@example.com', '789 Kids Lane, Pediatricville, PD 34567', 8, 'Pediatrics Plus');\n        ";
        let createAppointmentTable = "\n            CREATE TABLE IF NOT EXISTS Appointments (\n                id INT PRIMARY KEY AUTO_INCREMENT,\n                DoctorID INT,\n                Title VARCHAR(10),\n                ClientName VARCHAR(255),\n                Occupation VARCHAR(255),\n                Address TEXT,\n                Phone VARCHAR(20),\n                Email VARCHAR(255),\n                AppointmentDate DATETIME,\n                Result VARCHAR(50),\n                FurtherAction BOOLEAN,\n                LOA INT,\n                ClientStatus VARCHAR(100),\n                Issue TEXT,\n                FOREIGN KEY (DoctorID) REFERENCES Doctors(id) ON DELETE CASCADE\n            );\n        ";
        let fillAppointmentTable = "\n            INSERT INTO Appointments \n                (DoctorID, Title, ClientName, Occupation, Address, Phone, Email, AppointmentDate, Result, FurtherAction, LOA, ClientStatus, Issue)\n            VALUES\n                (1, 'Mrs', 'Alicia Smith', 'Nurse', '123 Example Way', '000-000-000', 'TestEmail12@34.com', '2024-09-15 10:00:00', 'N/A', false, 1, 'Healthy', 'General Checkup'),\n                (1, 'Mr', 'Robert Brown', 'Teacher', '456 Sample Road', '111-111-111', 'robert.brown@email.com', '2024-09-16 11:00:00', 'Pending', true, 2, 'Needs Follow-Up', 'Blood Pressure'),\n                (1, 'Ms', 'Emily Davis', 'Engineer', '789 Test Avenue', '222-222-222', 'emily.davis@email.com', '2024-09-17 14:00:00', 'Completed', false, 0, 'Healthy', 'Routine Checkup'),\n                (1, 'Mr', 'Michael Wilson', 'Lawyer', '101 Data Street', '333-333-333', 'michael.wilson@email.com', '2024-09-18 09:00:00', 'Completed', false, 0, 'Healthy', 'Routine Examination'),\n                (1, 'Ms', 'Sarah Moore', 'Artist', '202 Example Blvd', '444-444-444', 'sarah.moore@email.com', '2024-09-19 15:00:00', 'Completed', false, 0, 'Healthy', 'Health Review');\n        ";
        // Execute queries
        console.log("Begin")
        db.execute(createDoctorTable, function (err) {
            console.log("Creating doctor table");
            if (err)
                throw err;
            db.execute(fillDoctorTable, function (err) {
                console.log("Filling doctor table");
                if (err)
                    throw err;
                db.execute(createAppointmentTable, function (err) {
                    console.log("Creating Appointment table");
                    if (err)
                        throw err;
                    db.execute(fillAppointmentTable, function (err) {
                        console.log("Filling Appointment table");
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
app.get('/api/getDoctorData/:DoctorID' , function (req, res) {
    try {
        const SQL = "SELECT * FROM Doctors WHERE id = ?"
        const { DoctorID } = req.params;
        console.log("Getting Data for ".concat(DoctorID))
        if (!DoctorID) { res.status(400).json({ error: "Bad Request"})};

        db.execute(SQL, [DoctorID], function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.status(200).json({ results })
        } )
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
app.get('/api/getDoctors', function (req, res) {
    try {
        console.log("Getting Doctors");

        let SQL = "SELECT * FROM Doctors \n                     LEFT JOIN Appointments \n                     ON Doctors.ID = Appointments.DoctorID";
        db.execute(SQL, function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).json({ error: "Database query error" });
            }
            res.status(200).json({ data: results });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/getDoctorNames', async (req, res) => {
    try {
        console.log("Getting Doctor Names");

        let SQL = "SELECT id, name FROM Doctors";

        db.execute(SQL, function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }
            res.status(200).json({ results });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/getAppointments/:DoctorID", function (req, res) {
    try {
        const {DoctorID} = req.params;
        console.log("Getting appointmentData for DoctorID ".concat(DoctorID));       

        let SQL = "SELECT * FROM Appointments WHERE DoctorID = ?";

        db.execute(SQL,[DoctorID], function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }
            res.status(200).json({ results });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/api/testCookie", function (req, res) {
    try {
        console.log("Cookies: ", req.cookies);
        const cookie = req.cookies["Authorization"];

        if (!cookie) {
            return res.status(401).json({ message: "No Authorization cookie found" });
        }

        if (VerifyToken(cookie)) {
            res.status(200).json({ message: "Success" });
        } else {
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/Authorization/RefreshToken", function (req, res) {
    try {
        console.log("Refreshing Cookie");
        const data = req.data;
        const cookie = req.cookies["Authorization"];

        if (!cookie) {
            return res.status(401).json({ message: "No Authorization cookie found" });
        }
        
        const newToken = RefreshToken(cookie, data);

        res.cookie("Authorization", newToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none"
        })
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Credentials", "true");
        
        return res.status(200).json({ message: "Cookie refreshed"})
    
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/Authorization/Login", function (req, res) {
    try {
        const SQL = "SELECT UserName, Password, EmailAddress, Address, PhoneNumber, Title FROM UserData WHERE UserName = ?";
        const {UserName, Password} = req.body;

        if (!UserName || !Password) {
            return res.status(400).json({ error: "Missing Parameters"})
        }
        console.log("User is attempting to login Username:".concat(UserName));       

        db.execute(SQL,[UserName], async function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }
            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid username or password" });
            }            
            if (COMPARE(Password, results[0].Password)){
                console.log("Successfully compared")
                let { Password, ...userData } = results[0];
                let token = await CreateToken(userData);

                res.cookie("Authorization", token, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none"
                });

                res.header("Access-Control-Allow-Origin", "http://localhost:3000");
                res.header("Access-Control-Allow-Credentials", "true");

                return res.status(200).json({ message: "Successfully logged in", userData });
            } else {
                res.status(401).json({ error: "Unauthorized"})
            }
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/api/Authorization/Register", async function (req, res) {
    const SQLVerifyNotExist = "SELECT UserName FROM UserData WHERE UserName = ?";
    const SQLPlaceData = "INSERT INTO UserData (UserName, Password, EmailAddress, Address, PhoneNumber, Title) VALUES (?, ?, ?, ?, ?, ?)";
    
    const { Title,UserName,Password,EmailAddress,Address, PhoneNumber } = req.body;

    if (!Title || !UserName || !Password || !EmailAddress || !Address || !PhoneNumber) {
        return res.status(400).json({ error: "Missing Parameters" });
    }
    console.log("Registration attempt for new user", `${Title} ${UserName}`);

    try {
        const users = await db.execute(SQLVerifyNotExist, [UserName]);
        if (users.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await HASH(Password);
        db.execute(SQLPlaceData, [UserName, hashedPassword, EmailAddress, Address, PhoneNumber, Title], function (err, result) {
            if (err) {
                console.error("Server error:", error);
                res.status(500).json({ error: "Internal Server Error" });
            } else if (result.affectedRows === 1) {
                res.status(200).json({ message: "Successfully made account" });
            } else {
                res.status(500).json({ message: "Unable to determine result"})
            }           
        });


    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// DEV I KNOW TO REMOVE
app.post("/api/IllegalSQLInjectionTechnique", function (req, res) {
    try {
        const currDate = new Date().toISOString();
        const { sqlQuery } = req.body;

        if (!sqlQuery) {
            return res.status(400).json({ error: "Missing Parameters"})
        }
        console.log("Illegal Technique at ".concat(currDate));       

        db.execute(sqlQuery, function (err, results) {
            if (err) {
                console.error("Error executing query:", err);
                res.status(500).json({ error: "Database query error" });
                return;
            }
            res.status(200).json({ message: "Successfully injected Data" });
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
