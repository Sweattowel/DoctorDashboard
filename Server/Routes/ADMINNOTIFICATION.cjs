////////////////////////////////////////////
// HANDLE AND CREATE SYSTEM NOTIFICATIONS //
///////////////////////////////////////////

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
} = require("../Handlers/TokenHandle.cjs");
/////////////////////////////////////
// MiddleWare and DATABASE handling//
/////////////////////////////////////
const express = require("express");

const router = express.Router();
const db = require("../Database.cjs");

// Routing Functions
// Create appointment 
router.post("/SYSTEM/SYSTEMNOTIFICATIONS/CREATE", function (req, res) {
    try {        
		const cookie = req.cookies["Authorization"];

        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        };            

		console.log("Received Sys admin Notification CREATE request");
        const { Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, RequestType } = req.body;
        const DATE = new Date().toISOString().split('T')[0];
        const SQL = "INSERT INTO ADMINNotifications (Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, Date, RequestType, CompletedStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, false)"

		db.execute(SQL, [Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, DATE, RequestType], (err) => {
			if (err) {
                console.error("Failed to Collect notifications", err);
				return res.status(500).json({ error: "Internal Server Error" });
			}
			return res.status(200).json({ message: "Success" });
		})

	} catch (error) {
		console.error("Server error:", error);
		res.header("Removal-Request", "True");
		return res.status(500).json({ error: "Internal Server Error" });
	};
})

router.get("/SYSTEM/SYSTEMNOTIFICATIONS/COLLECT", function (req, res) {
    try {        
		const cookie = req.cookies["Authorization"];

        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        };            

		console.log("Received Sys admin Notification COLLECT request");

        const SQL = "SELECT * FROM ADMINNotifications"

		db.execute(SQL, (err, results) => {
			if (err) {
                console.error("Failed to Collect notifications", err);
				return res.status(500).json({ error: "Internal Server Error" });
			}
			return res.status(200).json({ message: "Success", results });
		})

	} catch (error) {
		console.error("Server error:", error);
		res.header("Removal-Request", "True");
		return res.status(500).json({ error: "Internal Server Error" });
	};
})

router.patch("/SYSTEM/SYSTEMNOTIFICATIONS/UPDATE/:NotificationID/:Complete", function (req, res) {
    try {        
		const cookie = req.cookies["Authorization"];

        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        };            

		console.log("Received Sys admin Notification COLLECT request");
        
        const NotificationID = req.params.NotificationID;
        const Complete = req.params.Complete;

        const SQL = "UPDATE ADMINNotifications set CompletedStatus = ? WHERE NotificationID = ?"

		db.execute(SQL, [Complete, NotificationID ], (err) => {
			if (err) {
                console.error("Failed to UPDATE notifications", err);
				return res.status(500).json({ error: "Internal Server Error" });
			}
			return res.status(200).json({ message: "Success" });
		})

	} catch (error) {
		console.error("Server error:", error);
		res.header("Removal-Request", "True");
		return res.status(500).json({ error: "Internal Server Error" });
	};
})


// FINAL EXPORT
module.exports = router;