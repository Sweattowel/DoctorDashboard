// Helper Functions
const { HASH, COMPARE } = require("./Handlers/EncryptionHandle.cjs");
const {
	CreateToken, VerifyToken, DecodeToken, RefreshToken, CreateAdminToken, VerifyAdminToken, RefreshAdminToken,
} = require("./Handlers/TokenHandle.cjs");
// CORE functions
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const https = require("https");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

const privateKey = fs.readFileSync(
	`Certificates/${process.env.SERVER_ADDRESS}-key.pem`,
	"utf8"
);
const certificate = fs.readFileSync(
	`Certificates/${process.env.SERVER_ADDRESS}.pem`,
	"utf8"
);

const credentials = { key: privateKey, cert: certificate };

const { error } = require("console");

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_DATABASE,
});

console.log(
	process.env.DATABASE_HOST,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	process.env.DATABASE_DATABASE
);

db.connect((err) => {
	if (err) {
		console.error(`Database failed to connect: ${err}`);
		return;
	}
	console.log("Connected to database");
});

const port = 3001;
const corsOptions = {
	origin: "http://localhost:3000",
	optionsSuccessStatus: 200,
	credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());

const httpServer = https.createServer(credentials, app);

httpServer.listen(port, process.env.SERVER_ADDRESS, () => {
	console.log(`Server is running on https://localhost:${port}`);
});

app.get("/api/getDoctorData/:DoctorID", function (req, res) {
	try {
		const SQL = "SELECT * FROM DoctorData WHERE id = ?";
		const { DoctorID } = req.params;
		console.log("Getting Data for ".concat(DoctorID));
		if (!DoctorID) {
			return res.status(400).json({ error: "Bad Request" });
		}

		db.execute(SQL, [DoctorID], function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			return res.status(200).json({ results });
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
app.get("/api/getDoctors", function (req, res) {
	try {
		console.log("Getting DoctorData");

		let SQL =
			"SELECT * FROM DoctorData \n                     LEFT JOIN Appointments \n                     ON DoctorData.id = Appointments.DoctorID";
		db.execute(SQL, function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			return res.status(200).json({ data: results });
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/api/getDoctorNames", async (req, res) => {
	try {
		console.log("Getting Doctor Names");

		let SQL = "SELECT id, UserName FROM DoctorData";

		db.execute(SQL, function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			return res.status(200).json({ results });
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/api/getAppointments/:DoctorID", function (req, res) {
	try {
		const { DoctorID } = req.params;
		console.log("Getting appointmentData for DoctorID ".concat(DoctorID));

		let SQL = "SELECT * FROM Appointments WHERE DoctorID = ?";

		db.execute(SQL, [DoctorID], function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			return res.status(200).json({ results });
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
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
			return res.status(200).json({ message: "Success" });
		} else {
			return res.status(401).json({ message: "Invalid token" });
		}
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/Authorization/RefreshToken", async function (req, res) {
	try {
		console.log("Refreshing Cookie");
		const data = req.body;
		const cookie = req.cookies["Authorization"];

		if (!cookie) {
			return res.status(401).json({ message: "No Authorization cookie found" });
		}
		let newToken = "";

		switch (true) {
			case data.isAdmin:
				newToken = await RefreshAdminToken(cookie, data);
				break;
			case data.isDoctor:
				newToken = await RefreshToken(cookie, data);
				break;
			case data.isUser:
				newToken = await RefreshToken(cookie, data);
				break;
			default:
				console.log("Token failed to refresh");
				return res.status(500).json({ message: "Fail" });
		}

		res.cookie("Authorization", newToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});
		res.header("Access-Control-Allow-Origin", "http://localhost:3000");
		res.header("Access-Control-Allow-Credentials", "true");

		return res.status(200).json({ message: "Cookie refreshed" });
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/Authorization/Login", function (req, res) {
	try {
		const SQL =
			"SELECT UserID, UserName, PassWord, EmailAddress, Address, PhoneNumber, Title FROM UserData WHERE UserName = ?";
		const { UserName, PassWord } = req.body;

		if (!UserName || !PassWord) {
			return res.status(400).json({ error: "Missing Parameters" });
		}
		console.log("User is attempting to login Username:".concat(UserName));

		db.execute(SQL, [UserName], async function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			if (results.length === 0) {
				return res.status(401).json({ error: "Invalid username or PassWord" });
			}
			if (COMPARE(PassWord, results[0].PassWord)) {
				console.log("Successfully compared");
				let { PassWord, ...userData } = results[0];
				let token = await CreateToken(userData);

				res.cookie("Authorization", token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				});

				res.header("Access-Control-Allow-Origin", "http://localhost:3000");
				res.header("Access-Control-Allow-Credentials", "true");

				return res
					.status(200)
					.json({ message: "Successfully logged in", userData });
			} else {
				return res.status(401).json({ error: "Unauthorized" });
			}
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
app.post("/api/Authorization/Register", async function (req, res) {
	const SQLVerifyTokenNotExist = "SELECT UserName FROM UserData WHERE UserName = ?";
	const SQLPlaceData =
		"INSERT INTO UserData (UserName, PassWord, EmailAddress, Address, PhoneNumber, Title) VALUES (?, ?, ?, ?, ?, ?)";

	const { Title, UserName, PassWord, EmailAddress, Address, PhoneNumber } =
		req.body;

	if (
		!Title ||
		!UserName ||
		!PassWord ||
		!EmailAddress ||
		!Address ||
		!PhoneNumber
	) {
		return res.status(400).json({ error: "Missing Parameters" });
	}
	console.log("Registration attempt for new user", `${Title} ${UserName}`);

	try {
		const users = await db.execute(SQLVerifyTokenNotExist, [UserName]);
		if (users.length > 0) {
			return res.status(400).json({ error: "User already exists" });
		}

		const hashedPassWord = await HASH(PassWord);
		db.execute(
			SQLPlaceData,
			[UserName, hashedPassWord, EmailAddress, Address, PhoneNumber, Title],
			function (err, result) {
				if (err) {
					console.error("Server error:", error);
					return res.status(500).json({ error: "Internal Server Error" });
				} else if (result.affectedRows === 1) {
					return res.status(200).json({ message: "Successfully made account" });
				} else {
					return res
						.status(500)
						.json({ message: "Unable to determine result" });
				}
			}
		);
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

app.get("/api/Profile/getUserAppointments/:UserID", async function (req, res) {
	const cookie = req.cookies["Authorization"];

	if (!cookie || !VerifyToken(cookie)) {
		res.header("Removal-Request", "True");
		return res.status(401).json({ message: "Token Verification Failed" });
	}

	const SQL = "SELECT * FROM Appointments WHERE UserID = ?";
	const { UserID } = req.params;

	if (!UserID) {
		return res.status(400).json({ error: "Missing Parameters" });
	}
	console.log("Collecting appointments for ".concat(UserID));

	try {
		db.execute(SQL, [UserID], (err, results) => {
			if (err) {
				return res.status(500).json({ error: "Internal Server Error" });
			}
			return res.status(200).json({ results });
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
app.post("/api/Authorization/DoctorLogin", function (req, res) {
	try {
		const SQL = "SELECT * FROM DoctorData WHERE UserName = ?";

		const { UserName, PassWord } = req.body;

        if (!UserName || !PassWord){
            return res.status(401).json({ error: "Bad request"});
        }

		db.execute(SQL, [UserName], async (err, result) => {
			if (err) {
				console.error("Server error:", err);
				return res.status(500).json({ error: "Internal Server Error" });
			}
			if (result.length === 1) {
				const check = await COMPARE(PassWord, result[0].PassWord);

				if (check) {
					const newToken = await CreateAdminToken({UserName});

					res.cookie("Authorization", newToken, {
						httpOnly: true,
						secure: true,
						sameSite: "none",
					});
					res.header("Access-Control-Allow-Origin", "http://localhost:3000");
					res.header("Access-Control-Allow-Credentials", "true");

					const { PassWord, ...UserData } = result[0];

					return res
						.status(200)
						.json({ message: "Successfully logged in", UserData });
				} else {
					return res.status(401).json({ message: "Incorrect Parameters" });
				}
			} else {
				return res.status(401).json({ message: "No user exists" });
			}
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
app.post("/api/Authorization/DoctorRegister", async function (req, res) {
    const cookie = req.cookies["Authorization"];

	if (!cookie || !VerifyAdminToken(cookie)) {
		res.header("Removal-Request", "True");
		return res.status(401).json({ message: "Token Verification Failed" });
	}

	const SQLVerifyTokenNotExist =
		"SELECT UserName FROM DoctorData WHERE UserName = ?";
	const SQLPlaceData =
		"INSERT INTO DoctorData (UserName, PassWord, EmailAddress, PhoneNumber ) VALUES (?, ?, ?, ?)";

	const { UserName, PassWord, EmailAddress, PhoneNumber } = req.body;

	if (!UserName || !PassWord || !EmailAddress || !PhoneNumber) {
		return res.status(400).json({ error: "Missing Parameters" });
	}
	console.log("Registration attempt for new Doctor", `Dr ${UserName}`);

	try {
		const users = await db.execute(SQLVerifyTokenNotExist, [UserName]);

		if (users.length > 0) {
			return res.status(400).json({ error: "Doctor already exists" });
		}

		const hashedPassWord = await HASH(PassWord);

		db.execute(
			SQLPlaceData,
			[UserName, hashedPassWord, EmailAddress, PhoneNumber],
			function (err, result) {
				if (err) {
					console.error("Server error:", err);

					return res.status(500).json({ error: "Internal Server Error" });
				} else if (result.affectedRows === 1) {
					return res.status(200).json({ message: "Successfully made account" });
				} else {
					return res
						.status(500)
						.json({ message: "Unable to determine result" });
				}
			}
		);
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
app.post("/api/Authorization/AdminLogin", function (req, res) {
	try {
		const SQL = "SELECT * FROM AdminData WHERE UserName = ?";
		const { UserName, PassWord } = req.body;
		console.log("Admin login attempt by ".concat(UserName));

		db.execute(SQL, [UserName], async (err, result) => {
			if (err) {
				console.error("Server error:", error);
				return res.status(500).json({ error: "Internal Server Error" });
			}
			if (result.length === 1) {
				const check = await COMPARE(PassWord, result[0].PassWord);

				if (check) {
					const newToken = await CreateAdminToken({ UserName });

					res.cookie("Authorization", newToken, {
						httpOnly: true,
						secure: true,
						sameSite: "none",
					});
					res.header("Access-Control-Allow-Origin", "http://localhost:3000");
					res.header("Access-Control-Allow-Credentials", "true");

					const { PassWord, ...UserData } = result[0];

					return res
						.status(200)
						.json({ message: "Successfully logged in", UserData });
				} else {
					return res.status(401).json({ message: "Incorrect Parameters" });
				}
			} else {
				return res.status(401).json({ message: "No user exists" });
			}
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
app.post("/api/Authorization/AdminCreate", async function (req, res) {
	const SQLVerifyTokenNotExist = "SELECT UserName FROM AdminData WHERE UserName = ?";
	const SQLPlaceData =
		"INSERT INTO AdminData (UserName, PassWord, EmailAddress, PhoneNumber ) VALUES (?, ?, ?, ?)";

	const { UserName, PassWord, EmailAddress, PhoneNumber } = req.body;

	if (!UserName || !PassWord || !EmailAddress || !PhoneNumber) {
		return res.status(400).json({ error: "Missing Parameters" });
	}
	console.log("Registration attempt for new Admin", `Dr ${UserName}`);

	try {
		const users = await db.execute(SQLVerifyTokenNotExist, [UserName]);
		if (users.length > 0) {
			return res.status(400).json({ error: "Doctor already exists" });
		}

		const hashedPassWord = await HASH(PassWord);

		db.execute(
			SQLPlaceData,
			[UserName, hashedPassWord, EmailAddress, PhoneNumber],
			function (err, result) {
				if (err) {
					console.error("Server error:", error);
					return res.status(500).json({ error: "Internal Server Error" });
				} else if (result.affectedRows === 1) {
					return res.status(200).json({ message: "Successfully made Admin" });
				} else {
					return res
						.status(500)
						.json({ message: "Unable to determine result" });
				}
			}
		);
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
// GET PREVIOUS SESSION
app.get("/api/Authorize/PreviousSession", async function (req, res) {
	try {
		const SQL =
			"SELECT UserID, UserName, PassWord, EmailAddress, Address, PhoneNumber, Title FROM UserData WHERE UserName = ?";
		const cookie = req.cookies["Authorization"];
		console.log("Finding previous session");

		if (!VerifyToken(cookie)) {
			res.header("Removal-Request", "True");
			return res.status(401).json({ message: "Invalid token" });
		}

		const decodedToken = await DecodeToken(cookie);

		const { UserName } = decodedToken;

		db.execute(SQL, [UserName], async function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			if (results.length === 0) {
				return res.status(401).json({ error: "Failed to VerifyToken" });
			}
			let { PassWord, ...userData } = results[0];
			let token = await CreateToken(userData);

			res.cookie("Authorization", token, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
			});

			res.header("Access-Control-Allow-Origin", "http://localhost:3000");
			res.header("Access-Control-Allow-Credentials", "true");

			return res
				.status(200)
				.json({ message: "Successfully logged in", userData });
		});
	} catch (error) {
		console.error("Server error:", error);
		res.header("Removal-Request", "True");
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
////////////////////////////////////////////////////////////////////////////////////////////////// Requests and notifications
// USER HANDLE NOTIFICATIONS
    app.post("/api/Notifications/CreateDoctorNotification", function (req, res) {
        try {
            const { RequestType, Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText} = req.body

            if (!RequestType){
                return res.status(400).json({ message: "Failed parameters" });
            }
            const cookie = req.cookies["Authorization"];

            if (!VerifyToken(cookie)) {
                res.header("Removal-Request", "True");
                return res.status(401).json({ message: "Invalid token" });
            }
            console.log(`Received Request to create notification of type: ${RequestType} From ${RequesterName}`)
            
            const SQL = "INSERT INTO DoctorNotifications (RequestType, Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, Date, CompletedStatus) values (?, ?, ?, ?, ?, ?, ?, ?, false)"
            
            const DATE = new Date().toISOString().split('T')[0]; 

            db.execute(SQL, [RequestType, Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, DATE], (err, result) => {
                if (err) {
                    console.error("Failed to make Doctor notification", err)
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                if (result.affectedRows == 1){
                    res.status(200).json({ message: "Successfully made request"});
                }
            });

        } catch (error) {
            console.error("Server error:", error);
            res.header("Removal-Request", "True");
            return res.status(500).json({ error: "Internal Server Error" });
        };
    });
    // COLLECT
    app.get("/api/Notifications/CollectUserNotifications/:UserID" , function (req, res) {
        try {        
            const cookie = req.cookies["Authorization"];
            if (!VerifyToken(cookie)) {
                res.header("Removal-Request", "True");
                return res.status(401).json({ message: "Invalid token" });
            }
            console.log("Received Notification Request");
    
            const UserID = req.params.UserID;
            const SQL = "SELECT * FROM UserNotifications WHERE RequesteeID = ?";
    
            db.execute(SQL, [UserID], (err, results) => {
                if (err) {
                    console.error("Failed to Collect User notification", err)
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                return res.status(200).json({ results });
            });
    
        } catch (error) {
            console.error("Server error:", error);
            res.header("Removal-Request", "True");
            return res.status(500).json({ error: "Internal Server Error" });
        };
    })
// DOCTOR HANDLE NOTIFICATIONS

app.post("/api/Notifications/CreateUserNotification", function (req, res) {
    try {
        const { RequestType, Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText} = req.body

        if (!RequestType){
            return res.status(400).json({ message: "Failed parameters" });
        }
        const cookie = req.cookies["Authorization"];

        if (!VerifyToken(cookie)) {
			res.header("Removal-Request", "True");
			return res.status(401).json({ message: "Invalid token" });
		}
        console.log(`Received Request to create notification of type: ${RequestType} From ${RequesterName}`)
        
        const SQL = "INSERT INTO UserNotifications (RequestType, Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, Date, CompletedStatus) values (?, ?, ?, ?, ?, ?, ?, ?, false)"
        
        const DATE = new Date().toISOString().split('T')[0]; 

        db.execute(SQL, [RequestType, Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, DATE], (err, result) => {
            if (err) {
                console.error("Failed to make User notification", err)
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (result.affectedRows == 1){
                res.status(200).json({ message: "Successfully made request"});
            }
        });

    } catch (error) {
        console.error("Server error:", error);
        res.header("Removal-Request", "True");
        return res.status(500).json({ error: "Internal Server Error" });
    };
});
// Collect Notifications
app.get("/api/Notifications/CollectDoctorNotifications/:DoctorID" , function (req, res) {
    try {        
        const cookie = req.cookies["Authorization"];
        if (!VerifyAdminToken(cookie)) {
			res.header("Removal-Request", "True");
			return res.status(401).json({ message: "Invalid token" });
		}
        console.log("Received Notification for Doctor Request");

        const DoctorID = req.params;
        const SQL = "SELECT * FROM DoctorNotifications WHERE RequesteeID = ?";

        db.execute(SQL, [DoctorID], (err, results) => {
            if (err) {
                console.error("Failed to Collect Doctor notification", err)
                return res.status(500).json({ error: "Internal Server Error" });
            }
            return res.status(200).json({ results });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.header("Removal-Request", "True");
        return res.status(500).json({ error: "Internal Server Error" });
    };
});


































// DEV I KNOW TO REMOVE
app.post("/api/IllegalSQLInjectionTechnique", function (req, res) {
	try {
		const currDate = new Date().toISOString();
		const { sqlQuery } = req.body;

		if (!sqlQuery) {
			return res.status(400).json({ error: "Missing Parameters" });
		}
		console.log("Illegal Technique at ".concat(currDate));

		db.execute(sqlQuery, function (err, results) {
			if (err) {
				console.error("Error executing query:", err);
				return res.status(500).json({ error: "Database query error" });
			}
			if (results && results.length > 0) {
				return res
					.status(200)
					.json({ message: "Successfully injected Data", results });
			} else {
				return res.status(200).json({ message: "Successfully injected Data" });
			}
		});
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});
