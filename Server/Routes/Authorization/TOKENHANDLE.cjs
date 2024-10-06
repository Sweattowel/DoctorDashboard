/////////////////////////////////////
// HANDLE AND CREATE NOTIFICATIONS //
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
/////////////////////////////////////
// MiddleWare and DATABASE handling//
/////////////////////////////////////
const express = require("express");

const router = express.Router();
const db = require("../../Database.cjs");

// Routing Functions

app.post("/Authorization/RefreshToken", async function (req, res) {
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
				newToken = await RefreshAdminToken(cookie, data);
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
// FINAL EXPORT
module.exports = router;