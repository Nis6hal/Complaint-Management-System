# Nepal Telecom AI-Powered Complaint Management System (CMS)

A production-grade, enterprise-ready **Hybrid AI Complaint Management System** tailored for Nepal Telecom (NTC). This system enhances a classic MERN stack (MongoDB, Express, React, Node.js) with a Python FastAPI Machine Learning & Deep Learning Inference Engine (DistilBERT / TF-IDF Ensemble).

---

## 🌟 System Overview & How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             React.js Frontend                               │
│        (MUI Components, Interactive AI Chatbot Widget, AI Analytics)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API (Axios)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Node.js / Express Backend                          │
│          (Authentication, Complaint Management, Chatbot Service)            │
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
               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Hybrid AI Decision Engine                          │
│   - ML Models: Strict Source-of-Truth for Category, Priority & Routing      │
│   - Rule / LLM Layer: Conversational Dialogue, Summaries & Troubleshooting   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Workflow Highlights
1. **Automated ML Classification**: When a customer submits a complaint (via web or interactive AI Chatbot), the text is processed by the **FastAPI Machine Learning Server**.
2. **Multi-Task Prediction**: The ML engine predicts:
   - **Category** (*Fiber Cut, LOS Red, Internet Slow, SIM Activation, Billing, IPTV, etc.*)
   - **Priority & Severity** (*Critical, High, Medium, Low*)
   - **Target Department** (*Fiber Team, Mobile Support, Billing, Network Operations*)
   - **Customer Sentiment** (*Happy, Neutral, Frustrated, Angry*)
   - **Prediction Confidence Score**
3. **Smart Troubleshooting**: Before registering a ticket, the AI Chatbot suggests domain-specific self-fix steps (e.g. checking ONT router LOS lights or VoLTE mobile settings).
4. **Duplicate Ticket Prevention**: Calculates TF-IDF Cosine Similarity (>85%) against existing database tickets to prevent duplicate spam.
5. **Manager AI Analytics**: Provides real-time SLA metrics, category breakdowns, department load, and next-day complaint forecasting.

---

## 📁 Repository Structure

```
complaint-management-system/
│
├── dataset_generator/          # Synthetic Telecom Complaint Data Generator
│   ├── generator.py            # Main generation pipeline runner
│   ├── complaint_templates.py  # Telecom categories, patterns & subcategories
│   ├── nepali_variations.py    # Nepglish text variations & typo engine
│   ├── locations.py            # Nepal Geography (Provinces & Districts)
│   ├── engineers.py            # Engineer assignment database
│   └── resolutions.py          # SLA resolution text templates
│
├── dataset/                    # Generated CSV Datasets
│   ├── complaints.csv          # Master dataset (15,000 records)
│   ├── train.csv               # 80% Training split (12,000 rows)
│   ├── validation.csv          # 10% Validation split (1,500 rows)
│   └── test.csv                # 10% Test split (1,500 rows)
│
├── ml/                         # Machine Learning & NLP Core
│   ├── preprocess.py           # Text cleaning, NLTK stop words & Lemmatization
│   ├── train.py                # Multi-model evaluation (LogReg, NB, SVM, RF)
│   ├── train_distilbert.py     # DistilBERT Transformer fine-tuning script
│   ├── evaluate.py             # Metrics computation (Acc, Prec, Rec, F1)
│   ├── predict.py              # Baseline ML inference engine
│   ├── predict_distilbert.py   # DistilBERT production inference engine
│   ├── reports/                # Confusion matrix visual heatmap plots
│   └── saved_model.pkl         # Production model package (Joblib)
│
├── api/                        # FastAPI High-Performance Model Endpoint
│   ├── main.py                 # FastAPI server (POST /predict, POST /duplicate-check)
│   └── schemas.py              # Pydantic request/response validation schemas
│
├── backend/                    # MERN Stack Node.js/Express Backend
│   ├── controllers/            # Controller logic (auth, complaints, AI)
│   ├── middleware/             # JWT Authentication & role protection
│   ├── models/                 # Mongoose schema definitions (User, Complaint)
│   ├── routes/                 # Express API routes (/api/auth, /api/complaints, /api/ai)
│   ├── services/               # aiService & stateful chatbotService
│   └── server.js               # Main Express app entrypoint
│
├── frontend/                   # MERN Stack React.js Frontend
│   ├── src/components/         # Reusable UI components & AIChatbotWidget.jsx
│   ├── src/pages/              # Dashboard, Admin, Profile & AIDashboardPage.jsx
│   └── src/App.js              # React Router setup
│
└── README.md
```

---

## 🧠 How the Models are Trained & Evaluated

### 1. Dataset Generation
- Data is generated via `dataset_generator/generator.py` producing 15,000+ realistic Nepal Telecom complaints.
- Includes realistic English, mixed Nepali-English ("Nepglish" e.g., *"WiFi xa tara internet chaina"*), user typos, technical jargon (*PPPoE, BGP, ONT, VoLTE*), and regional location mappings across all 7 provinces of Nepal.

### 2. Text Preprocessing & Feature Extraction (`ml/preprocess.py`)
- **Cleaning**: Lowercasing, removal of URLs, special characters, and digits.
- **Stopwords**: Standard English stopwords + custom Nepglish stopwords (`chha`, `bhayena`, `gardinus`, `plz`, `ntc`).
- **Lemmatization**: NLTK WordNet Lemmatization.
- **Vectorization**: Sublinear TF-IDF with `ngram_range=(1, 2)` (Unigrams + Bigrams).

### 3. Model Benchmark Results (`ml/evaluate.py`)
Multiple baseline classifiers were trained and benchmarked:

| Model Algorithm | Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| **Logistic Regression** | **1.00** | **1.00** | **1.00** | **1.00** |
| **Linear SVM (LinearSVC)** | **1.00** | **1.00** | **1.00** | **1.00** |
| **Naive Bayes (MultinomialNB)** | **1.00** | **1.00** | **1.00** | **1.00** |
| **Random Forest** | **1.00** | **1.00** | **1.00** | **1.00** |

### 4. Deep Learning Transformer (`ml/train_distilbert.py`)
- Fine-tuned **DistilBERT** (`distilbert-base-uncased`) for deep semantic classification, allowing future-proof deep learning inference without altering any frontend interfaces.

---

## 🚀 How to Run the System (Step-by-Step)

### Prerequisites
- **Node.js** (v16+)
- **Python** (v3.9+)
- **MongoDB** (Local or MongoDB Atlas)

---

### Step 1: Install Dependencies

#### Python Dependencies:
```bash
pip install nltk scikit-learn xgboost pandas faker fastapi uvicorn matplotlib seaborn joblib transformers torch
```

#### Node Backend Dependencies:
```bash
cd backend
npm install
```

#### React Frontend Dependencies:
```bash
cd frontend
npm install
```

---

### Step 2: Generate Dataset & Train ML Models

```bash
# 1. Generate 15,000 synthetic records
python -m dataset_generator.generator

# 2. Train and evaluate baseline ML models
python -m ml.train

# 3. (Optional) Fine-tune DistilBERT Transformer model
python -m ml.train_distilbert
```

---

### Step 3: Launch Services

Open 3 terminal windows to run all system layers:

#### Terminal 1: Launch FastAPI Model Server (Port 8000)
```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Terminal 2: Launch Node.js Backend Server (Port 5000)
```bash
cd backend
npm run dev  # or node server.js
```

#### Terminal 3: Launch React Frontend Application (Port 3000)
```bash
cd frontend
npm start
```

---

## 🧪 Testing API Endpoints

### Test ML Inference (`POST http://127.0.0.1:8000/predict`)
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{"complaint": "My ONT router LOS light is blinking red since rain."}'
```

**Response:**
```json
{
  "category": "LOS Red",
  "priority": "High",
  "department": "Fiber Team",
  "confidence": 0.96,
  "sentiment": "Frustrated",
  "aiSummary": "Possible los red issue: My ont router los light is blinking red..."
}
```

### Test AI Chatbot (`POST http://localhost:5000/api/ai/chat`)
```bash
curl -X POST "http://localhost:5000/api/ai/chat" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"message": "What is the status of ticket CMP000345?"}'
```

---

## 📌 Features & Architecture Compliance
- **Decoupled Architecture**: Clean separation between React UI, Express Backend, FastAPI Engine, and ML Model artifacts.
- **SOLID Principles**: Controllers, services, and models are isolated in separate files.
- **Vercel / Render Ready**: Frontend and backend are pre-configured with environment variables (`process.env.FASTAPI_URL`, `process.env.MONGO_URI`) for production deployment.
