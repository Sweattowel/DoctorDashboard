////////////////////////////////////////////
// HANDLE AND CREATE SYSTEM NOTIFICATIONS //
///////////////////////////////////////////

// AUXILIARY FUNCTIONS
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
// MIDDLEWARE AND DATABASE HANDLING //
/////////////////////////////////////
const express = require("express");

const router = express.Router();
const db = require("../Database.cjs");

// Routing Functions

// Create SYSTEM NOTIFICATION 
router.post("/SYSTEM/SYSTEMNOTIFICATIONS/CREATE/:Authorization", async function (req, res) {
    try {
        const cookie = req.params.Authorization;

        // Token verification
        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        }

        console.log("Received Sys admin Notification CREATE request");
        const { Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, RequestType } = req.body;

        // Call createSystemNotification and handle the result
        const result = await createSystemNotification({ Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, RequestType });
        
        return res.status(200).json({ message: "Notification created successfully", data: result });
    } catch (error) {
        console.error("Error in creating notification:", error);
        res.header("Removal-Request", "True");
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Collect SYSTEM NOTIFICATIONS
router.get("/SYSTEM/SYSTEMNOTIFICATIONS/COLLECT", function (req, res) {
    try {
        const cookie = req.cookies["Authorization"];

        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        }

        console.log("Received Sys admin Notification COLLECT request");

        const SQL = "SELECT * FROM ADMINNotifications";

        db.execute(SQL, (err, results) => {
            if (err) {
                console.error("Failed to collect notifications", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            return res.status(200).json({ message: "Success", results });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.header("Removal-Request", "True");
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update SYSTEM NOTIFICATIONS
router.patch("/SYSTEM/SYSTEMNOTIFICATIONS/UPDATE/:NotificationID/:Complete", function (req, res) {
    try {
        const cookie = req.cookies["Authorization"];

        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        }

        console.log("Received Sys admin Notification UPDATE request");
        
        const NotificationID = req.params.NotificationID;
        const Complete = req.params.Complete;

        const SQL = "UPDATE ADMINNotifications SET CompletedStatus = ? WHERE NotificationID = ?";

        db.execute(SQL, [Complete, NotificationID], (err) => {
            if (err) {
                console.error("Failed to update notifications", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            return res.status(200).json({ message: "Success" });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.header("Removal-Request", "True");
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// EXPORTED FUNCTIONS
const createSystemNotification = async (notificationData) => {
    try {
        const { Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, RequestType } = notificationData;
        const DATE = new Date().toISOString().split('T')[0];

        const SQL = "INSERT INTO ADMINNotifications (Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, Date, RequestType, CompletedStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, false)";

        return new Promise((resolve, reject) => {
            db.execute(SQL, [Urgency, RequesterID, RequesterName, RequesteeID, RequesteeName, NotificationText, DATE, RequestType], (err, results) => {
                if (err) {
                    console.error("Error executing SQL for notification creation", err);
                    reject(err);
                } else {
                    resolve({ message: "Notification created successfully", results });
                }
            });
        });
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// FINAL EXPORT
module.exports = { router, createSystemNotification };
