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

router.get("/getDoctorData/:DoctorID", function (req, res) {
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
router.get("/getDoctors", function (req, res) {
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

router.get("/getDoctorNames", async (req, res) => {
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

router.get("/getAppointments/:DoctorID", function (req, res) {
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

// FINAL EXPORT
module.exports = router;