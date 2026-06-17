# 📋 Complaint Management System

A full-stack web app where users can submit and track complaints, and admins can manage them — built with React, Node.js/Express, and MongoDB.

---

## 🗂️ Project Structure

```
complaint-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (name, email, password, role)
│   │   └── Complaint.js     # Complaint schema (title, category, status, priority)
│   ├── middleware/
│   │   └── auth.js          # JWT auth guard + admin-only guard
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Get current user
│   │   ├── complaints.js    # User: submit, view, delete complaints
│   │   └── admin.js         # Admin: view all, update, delete, stats, users
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js   # Global login state
    │   ├── utils/
    │   │   └── api.js           # Axios instance with JWT header
    │   ├── components/
    │   │   └── Sidebar.js       # Navigation sidebar
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js         # User overview + recent complaints
    │   │   ├── ComplaintForm.js     # Submit a new complaint
    │   │   ├── MyComplaints.js      # View & delete own complaints
    │   │   ├── AdminDashboard.js    # Admin stats (total, pending, resolved…)
    │   │   ├── AdminComplaints.js   # Manage all complaints
    │   │   └── AdminUsers.js        # View all registered users
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## ⚙️ How to Run

### 1. Set up MongoDB
- Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
- Copy the connection string

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```

Runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Runs at `http://localhost:3000`

---

## 🔐 Making a User an Admin

After registering normally, open MongoDB Compass or the Atlas UI and run:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## ✅ What's Done

### Backend
- [x] User registration & login with JWT
- [x] Password hashing with bcrypt
- [x] Role-based access (user / admin)
- [x] Submit, view, and delete complaints (users)
- [x] Admin can view all complaints, filter by status/category/priority
- [x] Admin can update complaint status, priority, and add notes
- [x] Admin dashboard stats (total, pending, in progress, resolved)
- [x] Admin can view all registered users
- [x] Auto-sets `resolvedAt` timestamp when a complaint is resolved

### Frontend
- [x] Login & Register pages
- [x] Protected routes (redirects if not logged in)
- [x] Admin-only routes (redirects regular users)
- [x] User dashboard with complaint summary stats
- [x] Submit complaint form (title, category, description, priority)
- [x] My Complaints page with status badges
- [x] Admin dashboard with stats overview
- [x] Admin complaints page with filtering
- [x] Admin users list
- [x] Sidebar navigation with logout
- [x] Clean dark-themed UI with custom design tokens

---

## 🔲 What's Remaining / Not Yet Done

- [ ] **Email notifications** — users don't get notified when their complaint status changes
- [ ] **Password reset / forgot password** flow
- [ ] **Edit complaint** — users can only delete, not edit a submitted complaint
- [ ] **File/image attachments** — users can't attach screenshots or documents
- [ ] **Search complaints** — no search bar on the My Complaints or Admin Complaints page
- [ ] **Pagination** — all complaints load at once (could be slow with many records)
- [ ] **User profile page** — no way for users to update their name, email, or password
- [ ] **Deployment** — not deployed yet (backend → Render, frontend → Vercel recommended)
- [ ] **Real-time updates** — status changes require a page refresh to appear

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (dark theme) |
