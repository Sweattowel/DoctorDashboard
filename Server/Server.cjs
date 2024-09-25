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
    console.log(`Server is running on https://localhost:${port}`);
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
        const data = req.body;
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
        const SQL = "SELECT UserID, UserName, Password, EmailAddress, Address, PhoneNumber, Title FROM UserData WHERE UserName = ?";
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

app.get("/api/Profile/getUserAppointments/:UserID", async function (req, res) {
    const cookie = req.cookies["Authorization"];

    if (!cookie) {
        return res.status(401).json({ message: "No Authorization cookie found" });
    }

    if (!VerifyToken(cookie)) {
        res.status(401).json({ message: "Invalid token" });
    }

    const SQL = "SELECT * FROM Appointments WHERE UserID = ?";
    const { UserID } = req.params;

    if (!UserID) {
        return res.status(400).json({ error: "Missing Parameters" });
    }
    console.log("Registration attempt for new user".concat(UserID));

    try {
        const Appointments = await db.execute(SQL, [UserID]);
        if (Appointments.length > 0) {
            res.status(200).json({ Appointments });
        } else {
            res.status(404).json({ message: "No appointments"});
        }


    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

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
            if (results && results.length > 0){
                res.status(200).json({ message: "Successfully injected Data", results });
            } else {
                res.status(200).json({ message: "Successfully injected Data" });
            }
            
        });
    }
    catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
