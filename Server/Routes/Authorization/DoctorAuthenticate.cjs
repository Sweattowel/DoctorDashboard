/////////////////////////////////////
//  Doctor LOGIN AND REGISTRATION  //
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
} = require("./Handlers/TokenHandle.cjs");
/////////////////////////////////////
// MiddleWare and DATABASE handling//
/////////////////////////////////////
const express = require("express");

const router = express.Router();
const db = require("../Database.cjs");

// Routing Functions

router.post("/Authorization/DoctorLogin", function (req, res) {
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
router.post("/Authorization/DoctorRegister", async function (req, res) {
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

module.exports = router;