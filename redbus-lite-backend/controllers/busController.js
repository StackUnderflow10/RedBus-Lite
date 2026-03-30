const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req,res) => {
    db.query("SELECT * FROM bus", (err,result) => {
        if(err) return res.status(500).json(err);
        res.json(result);
    })
});

router.get("/search", (req,res) => {
    const { start, dest } = req.query;

    db.query(
        "SELECT * FROM bus WHERE start_point = ? AND dest = ?",
        [start, dest],
        (err,result) => {
            if(err) return res.status(500).json(err);
            res.json(result);
        }
    )
});

router.post("/book", (req,res) => {
    console.log("REACT IS SENDING THIS:", req.body);

    let { name, age, bus_id, amount } = req.body;

    if (!amount) {
        amount = 550;
    }

    // STEP 1: Get bus details
    db.query(
        "SELECT start_point, dest FROM bus WHERE bus_id = ?",
        [bus_id],
        (err, busResult) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (busResult.length === 0) {
                return res.status(404).json({ error: "Bus not found" });
            }

            const { start_point, dest } = busResult[0];

            // STEP 2: Insert passenger
            db.query(
                "INSERT INTO passenger (name, age, booking_date, amount, bus_id, start_point, dest) VALUES (?, ?, CURDATE(), ?, ?, ?, ?)",
                [name, age, amount, bus_id, start_point, dest],
                (err, result) => {
                    if (err) {
                        console.error("MYSQL BOOKING ERROR:", err.sqlMessage || err);
                        return res.status(500).json({ error: err.sqlMessage });
                    }

                    // STEP 3: Update seats
                    db.query(
                        "UPDATE bus SET available_seats = available_seats - 1 WHERE bus_id = ?",
                        [bus_id],
                        (updateErr, updateResult) => {
                            if (updateErr) {
                                return res.status(500).json(updateErr);
                            }

                            res.json({ message: "Ticket booked successfully" });
                        }
                    );
                }
            );
        }
    );
}); 

router.post("/add", (req, res) => {
    const { bus_no ,capacity, available_seats, start_point, dest, travel_data } = req.body;

    db.query(
        "INSERT INTO bus (bus_no, capacity, available_seats, start_point, dest, travel_data) VALUES (?, ?, ?, ?, ?, ?)",
        [bus_no, capacity, available_seats, start_point, dest, travel_data],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Bus added successfully" });
        }
    );
});

module.exports = router;