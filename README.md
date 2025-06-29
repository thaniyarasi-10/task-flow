# TaskSpace

TaskSpace is a full-stack Todo Task Management Web Application that enables users to manage their tasks individually or collaboratively. Built during a hackathon, this project demonstrates complete full-stack capabilities — from authentication and database modeling to real-time updates and deployment.

---

## ✨ Features

* ✅ Google OAuth login (via Supabase)
* ✅ Create, update, delete tasks
* ✅ Share tasks with others by email
* ✅ Filter by due date, status, and priority
* ✅ Real-time task updates using Supabase Realtime
* ✅ Mobile-friendly responsive UI
* ✅ Toast notifications for user actions
* ✅ Basic offline support and error boundaries

---

## 🧱 Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React + Vite + Tailwind CSS          |
| Backend    | Node.js + Express.js                 |
| Database   | Supabase (PostgreSQL)                |
| Auth       | Supabase (Google OAuth)              |
| Real-Time  | Supabase Realtime / Socket.IO        |
| Deployment | Vercel (frontend), Railway (backend) |

---

## 📁 Folder Structure

```bash
taskspace/
│
├── backend/
│   ├── index.js
│   ├── routes/
│   ├── models/
│   └── controllers/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

## 📦 Setup Instructions

### 🔧 1. Clone the Repository

bash
git clone https://github.com/YOUR_USERNAME/taskspace.git
cd taskspace


---

### ⚙ 2. Backend Setup (/backend)

bash
cd backend
npm install


Create a .env file inside backend/ and add:


PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your_jwt_secret


Run backend locally:

bash
npm run dev


---

### 💻 3. Frontend Setup (/frontend)

bash
cd frontend
npm install


Create a .env file inside frontend/ and add:


VITE_SUPABASE_URL=https://your-project.supabase.co

VITE_SUPABASE_ANON_KEY=your-anon-key


Run frontend locally:

bash

npm run dev

---

## 🚀 Deployment Details

| Component | Platform | URL Example                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| Frontend  | Vercel   | [https://taskspace.vercel.app](https://taskspace.vercel.app)                          |
| Backend   | Railway  | [https://taskspace-api.up.railway.app](https://taskspace-api.up.railway.app)          |
| Database  | Supabase | [https://app.supabase.com/project/YOUR\_ID](https://app.supabase.com/project/YOUR_ID) |

---

## 📢 This project is a part of a hackathon run by [https://www.katomaran.com](https://www.katomaran.com)
