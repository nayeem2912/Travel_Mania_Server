# 🛠️ Travel Mania - Backend (Server)

This is the **backend** of the **Travel Mania** full-stack tour package booking platform, built using **Node.js**, **Express.js**, and **MongoDB**. It provides RESTful APIs to manage tour packages, user bookings, and integrates with **Firebase Authentication** for secure access.

---

## 🚀 Live Demo

🌐 [Live Website](https://travel-mania-nayeem129.netlify.app/)  
🔗 [GitHub Repository (Client)](https://github.com/Programming-Hero-Web-Course4/b11a11-client-side-nayeem2912)  
🔗 [GitHub Repository (Server)](https://github.com/Programming-Hero-Web-Course4/b11a11-server-side-nayeem2912)  


---

## 📦 Features

- 🔐 Firebase Authentication Verification (Middleware)
- 📦 Manage Tour Packages (Create, Read, Update, Delete)
- 📅 Booking System (Book, View, Cancel Bookings)
- 🧾 RESTful API Endpoints
- 🌐 CORS-enabled for frontend communication
- 📁 Organized MVC Folder Structure

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Firebase Admin SDK**
- **dotenv**
- **CORS**
- **body-parser**

---

## 🧪 API Endpoints

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| GET    | `/api/packages`       | Get all travel packages          |
| GET    | `/api/packages/:id`   | Get a single package by ID       |
| POST   | `/api/addPackages`       | Create a new travel package      |
| PUT    | `/api/updatePackage/:id`   | Update an existing package       |
| DELETE | `/api/packages/:id`   | Delete a travel package          |
| GET    | `/api/my-booking/:email`       | Get all bookings |
| POST   | `/api/bookNow`       | Create a new booking             |
              

> 🔐 Protected routes require Firebase ID token in the Authorization header.

---