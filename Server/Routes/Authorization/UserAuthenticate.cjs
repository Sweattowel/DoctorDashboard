/////////////////////////////////////
//   USER LOGIN AND REGISTRATION   //
/////////////////////////////////////

// AUXILLARY FUNCTIONS 
// TOKEN HANDLE

const {
	CreateToken, 
    VerifyToken, 
    DecodeToken, 
    RefreshToken, 
    CreateAdminToken, 
    VerifyAdminToken, 
    RefreshAdminToken,
} = require("../../Handlers/TokenHandle.cjs");

// Encryption Handle

const { 
	HASH, COMPARE 
} = require("../../Handlers/EncryptionHandle.cjs");

/////////////////////////////////////
// MiddleWare and DATABASE handling//
/////////////////////////////////////
const express = require("express");

const router = express.Router();
const db = require("../../Database.cjs");

// Routing Functions

router.post("/Authorization/Login", function (req, res) {
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
router.post("/Authorization/Register", async function (req, res) {
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

module.exports = router;