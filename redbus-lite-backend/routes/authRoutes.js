const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

//POST--- auth/register
router.post('/register',async(req,res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password)
        return res.status(400).json({ error: 'All fields required' });

    if(password.length < 6)
        return res.status(400).json({ error: 'Password must be at least 6 characters' });

    try{
        db.query(
            "SELECT user_id FROM users WHERE email = ?",
            [email],
            async(err, result) => {
                if(err) return res.status(500).json(err);

                if(result.length > 0){
                    return res.status(409).json({ error: "Email already exists" });
                }

                const hash = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users (name, email, password) VALUES (?, ? ,?)",
                    [name, email, hash],
                    (err,insertResult) => {
                        if(err) return res.status(500).json(err);

                        const user = {
                            user_id: insertResult.insertId,
                            name, 
                            email
                        };
                        const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d"});

                        res.status(201).json({ token, user });
                    }

                )
            }
        )
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
})

//POST--- /auth/login
router.post('/login',async(req,res) => {
    const{ email, password } = req.body;

    if(!email || !password)
        return res.status(400).json({ error: 'Email and password required'});

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async(err,result) => {
            if(err) return res.status(500).json(err);

            if(result.length === 0) {
                return res.status(401).json({ error:"Invalid email or password" });
            }
            const userRow = result[0];

            const valid = await bcrypt.compare(password, userRow.password);

            if(!valid) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const user = {
                user_id: userRow.user_id,
                name: userRow.name,
                email: userRow.email
            };

            const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

            res.json({ token, user });
        }
    )
})

module.exports = router;