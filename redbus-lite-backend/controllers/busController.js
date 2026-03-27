const express = require("express")
const router = express.Router()
const db = require("../db") // Assuming db.js is one directory up based on your path

router.get("/", (req,res) => {
    db.query("SELECT * FROM bus", (err,result) => {
        if(err) return res.status(500).json(err);
        res.json(result);
    })
})

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
})

router.post("/book", (req,res) => {
    const {name,age,bus_id} = req.body;

    db.query(
        "INSERT INTO passenger (name,age,bus_id) VALUES (?,?,?)",
        [name,age,bus_id],
        (err,result) => {
            if(err) return res.status(500).json(err);
            res.json({ message: "Ticket booked successfully"});
        }
    )
})

router.post("/add", (req, res) => {
    const { bus_no ,capacity, available_seats, start_point, dest, travel_data } = req.body;

    db.query(
        "INSERT INTO bus (bus_no, capacity, available_seats, start_point, dest, travel_data) VALUES (?, ?, ?, ?, ?, ?)",
        [bus_no,capacity, available_seats, start_point, dest, travel_data],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Bus added successfully" });
        }
    );
});

module.exports = router;