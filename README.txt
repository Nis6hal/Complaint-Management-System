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
- Create a free cluster at https://cloud.mongodb.com
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
After registering, run in MongoDB:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## ✅ What's Done
### Backend
- User registration & login with JWT
- Password hashing with bcrypt
- Role‑based access (user / admin)
- Submit, view, delete complaints (users)
- Admin can view all complaints, filter, update status/priority, add notes
- Admin dashboard stats (total, pending, in progress, resolved)
- Admin can view all users
- Auto‑sets `resolvedAt` when a complaint is resolved

### Frontend
- Login & Register pages
- Protected routes + admin‑only routes
- User dashboard with stats
- Complaint submission form
- My Complaints page with status badges
- Admin dashboard & complaints management
- Admin users list
- Sidebar navigation with logout
- Dark‑theme UI with custom design tokens

---

## 🔲 What's Remaining
- Email notifications
- Password reset flow
- Edit complaint feature
- File/image attachments
- Search complaints
- Pagination
- User profile page
- Deployment (Render/Vercel)
- Real‑time updates

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router 6 |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Custom CSS (dark theme) |
