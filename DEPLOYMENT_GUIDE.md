# 🚀 Deployment Guide: Render + Vercel

Deploy the **backend** to Render (persistent Node.js server) and the **frontend** to Vercel (static React app).

---

## Prerequisites

- **MongoDB Atlas account** ([cloud.mongodb.com](https://cloud.mongodb.com)) with connection string
- **GitHub account** (repo: `https://github.com/Nis6hal/Complaint-Management-System`)
- **Render account** ([render.com](https://render.com)) — free tier available
- **Vercel account** ([vercel.com](https://vercel.com)) — free tier available

---

## Step 1: Deploy Backend to Render

### 1.1 Create a new Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect GitHub: select your repo or paste `https://github.com/Nis6hal/Complaint-Management-System`
4. Click **Connect**

### 1.2 Configure the service

- **Name**: `complaint-api` (or any name)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (for testing)

### 1.3 Add Environment Variables

Click **Add Environment Variable** for each:

| Key | Value | Example |
|-----|-------|---------|
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/telecom_complaints` |
| `JWT_SECRET` | Any random secret string | `your_super_secret_jwt_key_change_this` |
| `NODE_ENV` | `production` | `production` |
| `PORT` | (optional, defaults to 10000) | `10000` |
| `DB_NAME` | (optional) MongoDB database name | `ComplaintMS` |

### 1.4 Deploy

- Click **Create Web Service**
- Wait 5–10 minutes for deployment
- Copy the deployed URL (e.g., `https://complaint-api.onrender.com`)

✅ **Backend URL**: `https://complaint-api.onrender.com/api`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create a new project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New...** → **Project**
3. Select your `Complaint-Management-System` repo
4. Click **Import**

### 2.2 Configure project settings

- **Project Name**: `comanagesys` (or any name)
- **Root Directory**: Set to `frontend`
  - In project import, scroll down and find the Root Directory field
  - Change from `.` to `frontend`

### 2.3 Build Settings (auto-detected for Create React App)

- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### 2.4 Add Environment Variables

Click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://complaint-api.onrender.com/api` |

⚠️ **Replace `complaint-api` with your actual Render backend name if different.**

### 2.5 Deploy

- Click **Deploy**
- Wait 2–5 minutes
- Visit your frontend URL (e.g., `https://comanagesys.vercel.app`)

✅ **Frontend is live!**

---

## Step 3: Test the Live App

1. **Open your Vercel frontend URL**
2. **Register a new user**
   - Email: `user@example.com`
   - Password: anything
3. **Log in** with the registered credentials
4. **Submit a complaint**
   - Title, category, description, priority
   - Should appear in "My Complaints" immediately
5. **Make yourself admin** (see below)

---

## 🔐 Making a User Admin

After registering, make yourself admin in MongoDB:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **Collections**
3. Open the `users` collection
4. Find your user document
5. Edit the `role` field: change `"user"` to `"admin"`
6. Log in again → you'll see **Admin Dashboard**

Alternatively, run in MongoDB Compass:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 📱 Application Features

### User Dashboard (`/dashboard`)
- View personal complaint statistics (Total, Pending, In Progress, Resolved)
- Submit new complaints
- View recent complaints list
- Access AI Chatbot for support

### Admin Dashboard (`/admin`)
- System-wide statistics (Total Complaints, Pending, In Progress, Resolved, Closed, Total Users)
- Complaints breakdown by Category and Priority
- Quick access to Manage Complaints and View Users

### AI Analytics Dashboard (`/ai-analytics`)
- AI-powered complaint intelligence and analytics
- Accessible only to admin users

### AI Chatbot
- Interactive chatbot widget available on all pages
- Provides smart troubleshooting and complaint status queries

---

## 🛠️ Troubleshooting

### "Sign in fails" or "Cannot connect to API"

1. **Check Vercel environment variable**
   - Go to Vercel Project Settings → Environment Variables
   - Verify `REACT_APP_API_URL` = your Render backend URL
   - If changed, **Redeploy**: Deployments → click latest → Redeploy

2. **Check Render backend is running**
   - Go to Render → your backend service
   - Check the Logs tab for errors
   - If deployment failed, click **Manual Deploy**

### "Render backend is slow"

- **Free tier spins down after inactivity**
- First request after inactivity may take 30+ seconds
- Visit the Render URL directly to "wake it up"
- Upgrade to paid tier if you need always-on

### "MongoDB connection error"

1. **Verify connection string in Render env vars**
   - Copy directly from MongoDB Atlas
   - Format: `mongodb+srv://username:password@cluster0.mongodb.net/database`

2. **Check MongoDB Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` to allow all IPs (for testing)
   - Or add Render's IP specifically

3. **Check Database name**
   - Ensure the database name in connection string matches your MongoDB Atlas database

---

## 📝 Environment Variables Reference

### Backend (`backend`)

| Variable | Example | Notes |
|----------|---------|-------|
| `MONGO_URI` | `mongodb+srv://...` | Required. Get from MongoDB Atlas |
| `JWT_SECRET` | `super_secret_key_123` | Required. Keep it secret! |
| `NODE_ENV` | `production` | Optional. Defaults to `development` |
| `PORT` | `10000` | Optional. Render uses `10000` by default |
| `DB_NAME` | `ComplaintMS` | Optional. Defaults to `ComplaintMS` |

### Frontend (`frontend`)

| Variable | Value | Notes |
|----------|-------|-------|
| `REACT_APP_API_URL` | `https://complaint-api.onrender.com/api` | Required. Points to backend |

---

## 🔄 After Deployment: Updating Your App

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. **Render auto-deploys** (if webhook is set up) or click **Manual Deploy** in Render

3. **Vercel auto-deploys** (if auto-deploy is enabled) or click **Redeploy** in Vercel

---

## 💡 Tips

- **Free tier hibernation**: Render spins down free web services after 15 min of inactivity. Upgrade to paid if you need always-on.
- **Vercel preview deployments**: Every GitHub push creates a preview URL for testing before merging to main.
- **Custom domain**: Both Render and Vercel support custom domains (upgrade to paid tier).

---

## ❓ Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas
