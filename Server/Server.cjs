const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

 const app = express();

const privateKey = fs.readFileSync(`Certificates/${process.env.SERVER_ADDRESS}-key.pem`,"utf8");
const certificate = fs.readFileSync(`Certificates/${process.env.SERVER_ADDRESS}.pem`,"utf8");
const credentials = { key: privateKey, cert: certificate };

// Middleware
app.use(cors(corsOptions = {origin: "http://localhost:3000", optionsSuccessStatus: 200, credentials: true }));
app.use(cookieParser());
app.use(express.json());

//// IMPORT ROUTES
// AUTH
const ADMINAUTH = require("./Routes/Authorization/ADMINAuthenticate.cjs");
const DoctorAUTH = require("./Routes/Authorization/DoctorAuthenticate.cjs");
const UserAUTH = require("./Routes/Authorization/UserAuthenticate.cjs");
// AUXILLARY TOKEN
const TokenRoutes = require("./Routes/Authorization/TOKENHANDLE.cjs");
// GENERAL TO BE CATERGORIZED
const AppointmentRoutes = require("./Routes/AppointmentHandle.cjs");
const GeneralDataCollectionRoutes = require("./Routes/DataCollectHandle.cjs");
const NotificationRoutes = require("./Routes/NotificationHandle.cjs");

const { SYSTEMNOTIFICATIONS, createSystemNotification } = require("./Routes/ADMINNOTIFICATION.cjs");

app.use('/api', ADMINAUTH );
app.use('/api', DoctorAUTH );
app.use('/api', UserAUTH );
app.use('/api', TokenRoutes );
app.use('/api', AppointmentRoutes );
app.use('/api', GeneralDataCollectionRoutes );
app.use('/api', NotificationRoutes );

// ADMIN, HANDS' OFF PIRATES'
app.use('/api', SYSTEMNOTIFICATIONS );

const httpServer = https.createServer(credentials, app);

httpServer.listen(3001, process.env.SERVER_ADDRESS, () => {
	console.log(`Server is running on https://localhost:3001`);
});








// WORKSHOPPING
// dev help functions
const { CreateToken, VerifyToken, DecodeToken, RefreshToken, CreateAdminToken, VerifyAdminToken, RefreshAdminToken,
} = require("./Handlers/TokenHandle.cjs");
const db = require("./Database.cjs");
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

// DEV TOOLS
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
