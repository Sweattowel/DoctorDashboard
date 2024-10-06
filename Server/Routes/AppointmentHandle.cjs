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
// Create appointment 

router.post("/Appointments/Create", function (req, res) {
    try {        
        const cookie = req.cookies["Authorization"];
        if (!VerifyAdminToken(cookie)) {
			res.header("Removal-Request", "True");
			return res.status(401).json({ message: "Invalid token" });
		};

        const { Address,AppointmentDate,ClientName,ClientStatus,DoctorID,Email,FurtherAction,Issue,LOA,Occupation,Phone,Result,Title} = req.body;
        console.log("Received Create Appointment Request for ", DoctorID, "By DoctorID ", DoctorID);

        // Verify that no prior appointment exists at the time with hour time
		const appointmentStart = new Date(AppointmentDate);
        const appointmentEnd = new Date(appointmentStart);
        appointmentEnd.setHours(appointmentStart.getHours() + 1); 

        const SQL = `
            SELECT * 
            FROM Appointments 
            WHERE DoctorID = ? 
              AND (
                  (AppointmentDate BETWEEN ? AND ?) OR 
                  (AppointmentDate + INTERVAL 1 HOUR BETWEEN ? AND ?)
              )
        `;

        db.execute(SQL, [DoctorID, appointmentStart, appointmentEnd, appointmentStart, appointmentEnd], (err, results) => {
            if (err) {
                console.error("Failed to Check for Appointment overlap", err)
                return res.status(500).json({ error: "Internal Server Error" });
            }
			if (results.length > 0) {
				return res.status(409).json({ message: "Appointment Conflict"});
			}

			const insertSQL = "INSERT INTO Appointments (Address, AppointmentDate, ClientName, ClientStatus, DoctorID, Email, FurtherAction, Issue, LOA, Occupation, Phone, Result, Title) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			const appointmentData = [Address, AppointmentDate, ClientName, ClientStatus, DoctorID, Email, FurtherAction, Issue, LOA, Occupation, Phone, Result, Title];

			db.execute(insertSQL, appointmentData, (err) => {
				if (err) {
					console.error("Failed to create appointment", err);
					return res.status(500).json({ error: "Internal Server Error" });
				}
				return res.status(200).json({ results });
			})
        });
    } catch (error) {
        console.error("Server error:", error);
        res.header("Removal-Request", "True");
        return res.status(500).json({ error: "Internal Server Error" });
    };
})




router.get("/Profile/getUserAppointments/:UserID", async function (req, res) {
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


// FINAL EXPORT
module.exports = router;