const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "bus_booking_system"
});

db.connect((err) => {
    if(err){
        console.error("DB connection failed:",err)
    }
    else{
        console.log("connected to mysql")
    }
})

module.exports = db;