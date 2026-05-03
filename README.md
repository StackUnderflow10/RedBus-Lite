# 🚌 Bus Booking System (Redbus Lite)

A full-stack bus booking application that allows users to search routes, book tickets for partial journeys, and manage reservations efficiently.

---

## 🚀 Features

* 🔍 Search buses between cities
* 📍 **Partial route booking** (e.g., Kolkata → Burdwan on a Kolkata → Asansol route)
* 💺 Seat selection system
* 💰 Dynamic fare calculation based on distance
* 🔐 Authentication (JWT / API Key support)
* 📖 Booking history tracking
* ⚡ Real-time seat availability (planned / optional)

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Axios
* Tailwind / CSS (depending on your setup)

### Backend

* Node.js
* Express.js

### Database

* MySQL

### DevOps / Tools

* Docker (optional)
* Git & GitHub

---

## 📂 Project Structure

```
bus-booking/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/bus-booking.git
cd bus-booking
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bus_db
JWT_SECRET=your_secret
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🐳 Docker Setup (Optional)

```bash
docker-compose up --build
```

---

## 🧠 Key Concept: Partial Route Booking

Unlike simple systems, this app supports **mid-route bookings**.

Example:

* Bus route: Kolkata → Durgapur → Asansol
* User can book:

  * Kolkata → Durgapur
  * Durgapur → Asansol

### How it works:

* Routes are stored with **ordered stops**
* Fare is calculated based on **distance between stops**
* Seat availability is tracked per segment

---

## 📡 API Overview

### Auth

* `POST /api/auth/login`
* `POST /api/auth/register`

### Buses

* `GET /api/buses`
* `GET /api/buses/:id`

### Bookings

* `POST /api/bookings`
* `GET /api/bookings/user`

---

## 🔐 Authentication

Use either:

* JWT Token (recommended)
* API Key in headers

Example:

```
Authorization: Bearer <token>
```

---

## 🛠️ Future Improvements

* 🔴 Live seat tracking
* 📍 GPS-based bus tracking
* 💳 Payment integration (Razorpay/Stripe)
* 📱 Mobile responsive UI improvements
* 🧠 AI-based demand pricing (if you want to go crazy with it)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by **You** 😄
(Replace with your name / GitHub profile)

---
