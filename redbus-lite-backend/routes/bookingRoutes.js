const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

function requireAuth(req,res,next) {
    const header = req.headers.authorization;

    if(!header || !header.startsWith('Bearer '))
        return res.status(401).json({ error: 'Authentication required'});

    try{
        const token = header.split(' ')[1];
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    }
    catch{
        res.status(401).json({ error:'Invalid or expired token' });
    }
}

router.get('/seats/:bus_id',(req,res) => {
    const { bus_id } = req.params;

    db.query(
        "SELECT seats FROM bookings WHERE bus_id = ?",
        [bus_id],
        (err,results) => {
            if(err) return res.status(500).json(err);

            let booked = [];
            results.forEach(r => {
                booked.push(...JSON.parse(r.seats));
            });

            res.json(booked);
        }

    )
})

router.get('/my', requireAuth, (req,res) => {
    const user_id = req.user.user_id;

    db.query(
            `SELECT b.*, bus.bus_no, bus.start_point, bus.dest, bus.travel_data
            FROM bookings b
            JOIN bus ON bus.bus_id = b.bus_id
            WHERE b.user_id = ?
            ORDER BY b.booked_at DESC`,
            [user_id],
            (err,results) => {
                if(err) return res.status(500).json(err);

                const formatted = results.map(r => ({
                    ...r,
                    seats: JSON.parse(r.seats)
                }))
                res.json(formatted)
            }
    )
})

router.post('/book', requireAuth, (req,res) => {
    const { bus_id, seats } = req.body;
    const user_id = req.user.user_id;

    if(!bus_id || !Array.isArray(seats) || seats.length === 0){
        return res.status(400).json({ error: 'bus_id and seats required'});
    }

    if(seats.length > 4){
        return res.status(400).json({ error: 'Max 4 seats allowed' });
    }

    db.query(
        "SELECT * FROM bus WHERE bus_id = ?",
        [bus_id],
        (err,busResult) => {
            if(err) return res.status(500).json(err);

            if(busResult.length === 0){
                return res.status(404).json({ error:"Bus not found" });
            }

            const bus = busResult[0];

            if(bus.available_seats < seats.length) {
                return res.status(400).json({ error: "Not enough seats available" });
            }

            db.query(
                "SELECT seats FROM bookings WHERE bus_id = ?",
                [bus_id],
                (err,rows) => {
                    if(err) return res.status(500).json(err);


                    let bookedSeats = [];
                    rows.forEach(r => {
                        bookedSeats.push(...JSON.parse(r.seats));
                    });

                    const conflict = seats.find(s => bookedSeats.includes(s));
                    if(conflict) {
                        return res.status(400).json({ error:`Seat ${conflict} already booked`})
                    }

                    db.query(
                        "INSERT INTO bookings (user_id, bus_id, seats) VALUES (?,?,?)",
                        [user_id, bus_id, JSON.stringify(seats)],
                        (err,result) => {
                            if(err) return res.status(500).json(err);


                            db.query(
                                "UPDATE bus SET available_seats = available_seats - ? WHERE bus_id =?",
                                [seats.length, bus_id],
                                (err) => {
                                    if(err) return res.status(500).json(err);

                                    res.json({
                                        message: "Seats booked successfully",
                                        seats
                                    })
                                }
                            )
                        }
                    )
                } 
            )
        }
    )
})

module.exports = router;