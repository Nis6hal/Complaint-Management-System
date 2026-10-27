# TelcoResolve — AI-Powered Telecom Complaint Management System (CMS)

A production-grade, full-stack **Hybrid AI Complaint Management System** designed for modern telecommunications service providers. Built with a MERN stack (MongoDB, Express, React, Node.js) paired with a high-performance Python FastAPI Machine Learning and Deep Learning inference server (DistilBERT / TF-IDF Ensemble + Groq LLM fallback).

---

## 🌟 System Architecture & Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       React.js Frontend (TelcoResolve)                      │
│   (Responsive UI, Site-Wide AI Chatbot Widget, Quick Tracker, AI NOC Digest)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (Axios / JWT)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Node.js / Express Backend                          │
│          (Authentication, Complaint Management, Chatbot Engine)             │
└──────────────┬───────────────────────────────────────────────┬──────────────┘
               │                                               │
        MongoDB Database                               HTTP Calls (Axios)
   (Complaints with AI Metadata)                               │
               │                                               ▼
               │                            ┌─────────────────────────────────┐
               │                            │       FastAPI Model Server      │
               │                            │  (DistilBERT / TF-IDF Ensemble, │
               │                            │   Sentiment, Cosine Similarity) │
               │                            └─────────────────────────────────┘
               ▼                                               │
┌──────────────────────────────────────────────────────────────┴──────────────┐
│                          Hybrid AI Decision Engine                          │
│   • ML Server (FastAPI): Source of truth for Category, Priority & Routing   │
│   • Groq LLaMA3 / Fallback: Conversational Troubleshooting & Empathetic Chat│
│   • Cosine Similarity Engine: TF-IDF duplicate ticket detection (>85%)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🤖 Intelligent AI Chatbot Assistant (Aastha)
- **Site-Wide Availability**: Available globally across landing page, subscriber dashboard, and admin console.
- **Guest & Authenticated Sessions**: Guests can get instant self-service troubleshooting without logging in; authenticated users can register tickets in 1-click.
- **Natural Language Diagnostics**: Understands English and mixed Romanized ("Nepglish") queries (e.g., *"LOS red light blinks"* or *"router tataera net aayena"*).
- **Domain-Specific Troubleshooting**: Actionable steps for ONT optical routers, patch cords, 4G/5G mobile settings, VoLTE, and IPTV before filing tickets.
- **Quick Controls**:
  - 🔄 **1-Click Reset / Restart Conversation**
  - 📋 **Copy to Clipboard** on response bubbles with instant visual feedback
  - 📱 **Auto-Prefill Contact Phone** from subscriber profile
  - 📲 **Mobile Bottom-Sheet**: Native pull-handle drawer with touch-friendly spacing and virtual keyboard support.

### 🌐 Modernized & Mobile-Responsive Landing Page
- **Clean TelcoResolve Branding**: Sleek dark navy and vibrant blue palette (`#0f172a`, `#1d4ed8`).
- **Interactive Quick Ticket Tracker**: Instant status lookup directly from the hero section.
- **Interactive FAQ Accordion**: Expandable Q&A items with smooth chevron transitions.
- **Service Category Pills**: FTTH Fiber, Mobile 4G/5G, Billing & Recharge, Landline & IPTV.
- **Operational Pillars & 3-Stage Lifecycle Stepper**: Transparent triage, assignment, and resolution.
- **Mobile Navigation**: Collapsible hamburger menu and app-style slide-down drawer.

### 📊 Operations & Admin NOC Dashboard
- **Automated Routing**: Routes incoming complaints to the correct department (*Fiber Team, Mobile Support, Billing, Network Operations*).
- **Severity Prediction**: Auto-prioritizes tickets into *Critical, High, Medium, Low* based on text severity.
- **Duplicate Prevention**: Vectorizes complaints against open tickets to flag similar issues.
- **Real-Time Analytics**: Visual breakdown of category frequency, department backlog, sentiment distribution, and SLA resolution velocity.

---

## 📁 Repository Structure

```
complaint-management-system/
│
├── dataset_generator/          # Synthetic Telecom Complaint Data Generator
│   ├── generator.py            # Master generation pipeline
│   ├── complaint_templates.py  # Service categories, issues & subcategories
│   ├── nepali_variations.py    # Romanized Nepglish phrases & typo synthesizer
│   ├── locations.py            # Province and district mapping
│   ├── engineers.py            # NOC technician assignment registry
│   └── resolutions.py          # SLA field resolution text templates
│
├── dataset/                    # Generated CSV Datasets
│   ├── complaints.csv          # Master dataset (15,000 records)
│   ├── train.csv               # 80% Training split (12,000 rows)
│   ├── validation.csv          # 10% Validation split (1,500 rows)
│   └── test.csv                # 10% Test split (1,500 rows)
│
├── ml/                         # Machine Learning Core
│   ├── preprocess.py           # Text cleaning, custom stopwords & lemmatization
│   ├── train.py                # Multi-model evaluation (LogReg, LinearSVC, MNB, RF)
│   ├── train_distilbert.py     # DistilBERT Transformer fine-tuning script
│   ├── evaluate.py             # Performance metric computation (Acc, Prec, Rec, F1)
│   ├── predict.py              # TF-IDF inference engine
│   ├── predict_distilbert.py   # DistilBERT production inference engine
│   ├── reports/                # Heatmaps and confusion matrices
│   └── saved_model.pkl         # Serialized production pipeline
│
├── api/                        # FastAPI High-Performance Model Endpoint
│   ├── main.py                 # FastAPI server (POST /predict, POST /duplicate-check)
│   └── schemas.py              # Pydantic request/response validation schemas
│
├── backend/                    # Node.js & Express REST API
│   ├── controllers/            # Controller logic (auth, complaints, AI)
│   ├── middleware/             # JWT auth & optionalProtect middleware
│   ├── models/                 # Mongoose schemas (User, Complaint)
│   ├── routes/                 # API routes (/api/auth, /api/complaints, /api/ai)
│   ├── services/               # aiService (Groq LLM) & chatbotService
│   └── server.js               # Express application entrypoint
│
├── frontend/                   # React.js Client Application
│   ├── src/components/         # AIChatbotWidget, Header, Sidebar
│   ├── src/pages/              # LandingPage, Dashboard, MyComplaints, AdminDashboard, etc.
│   ├── src/index.css           # TelcoResolve responsive design system
│   └── src/App.js              # Application routing & global providers
│
└── README.md
```

---

## 🧠 Machine Learning Benchmark Results

Multiple baseline algorithms were trained on the preprocessed 15,000-record dataset:

| Model Algorithm | Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **1.00** | **1.00** | **1.00** | **1.00** |
| **Linear SVM (LinearSVC)** | **1.00** | **1.00** | **1.00** | **1.00** |
| **Naive Bayes (MultinomialNB)** | **1.00** | **1.00** | **1.00** | **1.00** |
| **Random Forest** | **1.00** | **1.00** | **1.00** | **1.00** |

Fine-tuned **DistilBERT** (`distilbert-base-uncased`) is also available as a deep learning classifier via `ml/predict_distilbert.py`.

---

## 🚀 Getting Started (Step-by-Step)

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **MongoDB** (Local instance or MongoDB Atlas connection URI)

---

### Step 1: Environment Variables Setup

#### 1. Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ComplaintMS?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
FASTAPI_URL=http://127.0.0.1:8000
GROQ_API_KEY=your_groq_api_key_here
```

#### 2. Frontend (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 2: Install Dependencies

#### Python ML & API:
```bash
pip install nltk scikit-learn xgboost pandas faker fastapi uvicorn matplotlib seaborn joblib transformers torch
```

#### Node.js Backend:
```bash
cd backend
npm install
```

#### React Frontend:
```bash
cd frontend
npm install
```

---

### Step 3: (Optional) Generate Dataset & Train Models

```bash
# Generate 15,000 synthetic telecom complaint records
python -m dataset_generator.generator

# Train baseline ML classifiers
python -m ml.train

# (Optional) Fine-tune DistilBERT Transformer
python -m ml.train_distilbert
```

---

### Step 4: Run the Application

Open **3 terminals** to run the complete ecosystem:

#### Terminal 1 — FastAPI Machine Learning Server (Port 8000):
```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2 — Node.js / Express Backend (Port 5000):
```bash
cd backend
npm run dev
```

#### Terminal 3 — React Frontend (Port 3000):
```bash
cd frontend
npm start
```

Visit **`http://localhost:3000`** in your browser.

---

## 🧪 Testing API Endpoints

### 1. Test ML Prediction (`POST http://127.0.0.1:8000/predict`)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"complaint": "My optical fiber router LOS light is blinking red since yesterday."}'
```

**Sample Response:**
```json
{
  "category": "LOS Red",
  "priority": "High",
  "department": "Fiber Team",
  "confidence": 0.96,
  "sentiment": "Frustrated",
  "aiSummary": "Possible los red issue: My optical fiber router los light..."
}
```

### 2. Test AI Chatbot (`POST http://localhost:5000/api/ai/chat`)
```bash
curl -X POST "http://localhost:5000/api/ai/chat" \
     -H "Content-Type: application/json" \
     -d '{"message": "My fiber internet is very slow and disconnects frequently."}'
```

---

## 🛡️ License & Acknowledgements
This project is an open, production-ready demonstration platform showcasing decoupled MERN architecture with stateful Python NLP/LLM AI services. Built with modern web accessibility, responsive ergonomics, and industry-standard design principles.
