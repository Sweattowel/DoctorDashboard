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
} = require("./Handlers/TokenHandle.cjs");
/////////////////////////////////////
// MiddleWare and DATABASE handling//
/////////////////////////////////////
const express = require("express");

const router = express.Router();
const db = require("../Database.cjs");

// Routing Functions

router.post("/Notifications/CreateDoctorNotification", function (req, res) {}, function (req, res) {
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
router.get("/Notifications/CollectUserNotifications/:UserID" , function (req, res) {
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

router.post("/Notifications/CreateUserNotification/:id/complete", function (req, res) {}, function (req, res) {
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
router.get("/Notifications/CollectDoctorNotifications/:DoctorID" , function (req, res) {
    try {        
        const cookie = req.cookies["Authorization"];
        if (!VerifyAdminToken(cookie)) {
            res.header("Removal-Request", "True");
            return res.status(401).json({ message: "Invalid token" });
        };

        const DoctorID = req.params.DoctorID;
        console.log("Received Notification Request for Doctor ", DoctorID);

        
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


// COMPLETE AND UNCOMPLETE NOTIFICATIONS 

router.patch("/Notifications/:NotificationID/complete", function (req, res) {
	try {        
		// TODO Implement a method to serperate User Doctor and admin traffic here i.e. check for Status and then check the token and change accordingly
		const cookie = req.cookies["Authorization"];
		if (!VerifyAdminToken(cookie)) {
			res.header("Removal-Request", "True");
			return res.status(401).json({ message: "Invalid token" });
		};

		const { NotificationID } = req.params.id;
		console.log("Received Complete Notification Request for ".concat(NotificationID));

		db.execute(SQL, [NotificationID], (err) => {
			if (err) {
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

router.patch("/Notifications/:NotificationID/unComplete", function (req, res) {
	try {        
		const cookie = req.cookies["Authorization"];
		if (!VerifyAdminToken(cookie)) {
			res.header("Removal-Request", "True");
			return res.status(401).json({ message: "Invalid token" });
		};

		const { NotificationID } = req.params.id;
		const SQL = "UPDATE TABLE "
		console.log("Received Complete Notification Request for ".concat(NotificationID));

		db.execute(SQL, [NotificationID], (err) => {
			if (err) {
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