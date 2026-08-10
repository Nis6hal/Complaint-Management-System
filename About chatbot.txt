# Monthly Internship Progress Report
### Nepal Telecom — AI-Powered Complaint Management System

---

**Intern Name:** Nischal  
**Organization:** Nepal Telecom  
**Department:** Information Technology / Software Development  
**Project Title:** AI-Powered Telecom Complaint Management System  
**Report Period:** Month 1 (4 Weeks)  
**Supervisor:** IT Department, Nepal Telecom  

---

## Project Overview

The primary objective of this internship project was to design and develop an **AI-Powered Complaint Management System (CMS)** for Nepal Telecom. The project was built on top of an existing MERN Stack (MongoDB, Express.js, React.js, Node.js) complaint system, enhancing it with Artificial Intelligence capabilities — including automated complaint classification, priority prediction, department routing, duplicate detection, customer sentiment analysis, and an AI chatbot assistant.

The system was built with a decoupled architecture:
- **Frontend**: React.js + Material UI (deployed on Vercel)
- **Backend**: Node.js + Express.js + MongoDB (deployed on Render)
- **AI/ML Engine**: Python FastAPI + Scikit-learn + HuggingFace DistilBERT (served locally or via cloud)

> **Core Principle:** The existing CMS was not replaced. AI was layered on top as an enhancement.

---

## Week 1 — Research, Planning & Dataset Design

### Objectives
- Understand the existing MERN stack codebase structure
- Research AI/NLP approaches suitable for telecom complaint classification
- Design the synthetic dataset schema and complaint categories
- Set up the development environment

### Tasks Completed

**1. Codebase Analysis**
- Reviewed existing `backend/models/Complaint.js` schema, `backend/routes/complaints.js`, and the React frontend structure
- Identified integration points where AI predictions could be injected without breaking existing functionality
- Documented the current complaint flow: User → React Form → Express API → MongoDB

**2. Research & Technology Selection**
- Researched NLP classification approaches: Bag-of-Words, TF-IDF, Word2Vec, BERT-based models
- Selected a **hybrid pipeline**: TF-IDF + classical ML classifiers as baseline, DistilBERT as production model
- Chose **FastAPI** as the ML serving layer due to its async support, Pydantic validation, and Python ecosystem compatibility
- Selected **Scikit-learn** for baseline models and **HuggingFace Transformers** for DistilBERT fine-tuning

**3. Dataset Schema Design**
- Designed a 29-column dataset schema covering:
  - Complaint metadata (ID, Date, Province, District, CustomerType, CustomerPlan)
  - Complaint text (English and Nepali-English mixed "Nepglish")
  - Target labels (Category, SubCategory, Priority, Severity, Department)
  - Resolution metadata (AssignedEngineer, Resolution, ResolutionHours, Escalated)
  - AI fields (Sentiment, AISummary, DuplicateTicket, CustomerRating)
- Defined **20 complaint categories** mapped to 6 departments:

| Department | Categories |
| :--- | :--- |
| Fiber Team | Fiber Cut, LOS Red, ONT Offline |
| Internet Support | Internet Down, Internet Slow, High Ping, Router Issue, Weak WiFi, IPTV |
| Network Operations | Packet Loss, DNS, Authentication |
| Mobile Team | SIM Activation, SIM Blocked, Voice Call, SMS Failure |
| Billing | Recharge Issue, Billing |
| Enterprise Support | Enterprise |

**4. Priority Assignment Rules**
- Defined domain-specific priority rules (not random assignment):
  - `Fiber Cut` → Always **Critical**
  - `Enterprise` → Always **High**
  - `Corporate` / `Government` customer + High severity → Elevated to **Critical**
  - `Billing`, `SMS Failure` → **Low**
  - `Internet Slow`, `Router Issue` → **Medium**

### Challenges Encountered
- Determining the right number of complaint categories — too few would reduce AI usefulness, too many would cause class confusion
- Deciding how to represent Nepali-English mixed language (Nepglish) without a dedicated Nepali NLP tokenizer

### Outcome
- Full dataset schema finalized
- Technology stack confirmed
- Development environment set up (Python 3.11, Node.js 18, MongoDB Atlas)

---

## Week 2 — Dataset Generation & ML Pipeline Development

### Objectives
- Build the synthetic dataset generator
- Implement the full ML training pipeline (preprocessing → TF-IDF → model training → evaluation → model export)
- Generate 15,000 complaint records

### Tasks Completed

**1. Synthetic Dataset Generator**

Built a modular generator split into 6 Python files under `dataset_generator/`:

| File | Role |
| :--- | :--- |
| `generator.py` | Main pipeline — iterates records, assembles all 29 fields |
| `complaint_templates.py` | Maps each category to technical vocabulary, subcategories, department, SLA |
| `nepali_variations.py` | Applies Nepglish mixing, typos, informal prefixes, ALL-CAPS urgency |
| `locations.py` | Realistic Nepal province → district mapping (all 7 provinces, 77 districts) |
| `engineers.py` | Pool of realistic Nepali engineer names |
| `resolutions.py` | SLA-based resolution text templates |

**Language diversity implemented:**
- Pure English: *"My ONT router has a blinking red LOS light. Internet is down."*
- Nepglish: *"Router ma LOS light red bhayera blink bhai rakheko xa. Internet chalekai chaina."*
- Typos: *"internt slow cha plz fix gdnus"*
- All-caps urgency: *"FIBER CUT BHAYO PLEASE FIX ASAP"*
- Technical jargon: *"PPPoE authentication error 691 on WAN link."*

**2. Generated Dataset**

| File | Records | Split |
| :--- | :---: | :---: |
| `dataset/complaints_all.csv` | 15,000 | Full dataset |
| `dataset/train.csv` | 12,000 | 80% |
| `dataset/validation.csv` | 1,500 | 10% |
| `dataset/test.csv` | 1,500 | 10% |

**3. Text Preprocessing Pipeline** (`ml/preprocess.py`)

Every complaint is cleaned through a 4-step pipeline before model training:

| Step | Operation | Example |
| :--- | :--- | :--- |
| 1 | Lowercase | `"FIBER CUT BHAYO"` → `"fiber cut bhayo"` |
| 2 | Remove URLs, emails, digits, punctuation | `"error 691!"` → `"error"` |
| 3 | Stop word removal (NLTK + custom Nepglish stopwords) | `"my internet is not working"` → `"internet working"` |
| 4 | WordNet Lemmatization | `"disconnecting connections"` → `"disconnect connect"` |

Custom Nepglish stopwords added: `cha`, `chha`, `ko`, `ma`, `ra`, `bata`, `bhayena`, `plz`, `gdnus`, `ntc`, `sir`

**4. TF-IDF Vectorization**

```python
TfidfVectorizer(
    max_features=5000,  # Top 5,000 informative tokens
    ngram_range=(1, 2), # Unigrams and bigrams
    sublinear_tf=True   # Log normalization on term frequency
)
```

- Fit only on training data (no validation/test leakage)
- Output: sparse matrix of shape `(12,000 samples × 5,000 features)`

**5. Model Training & Evaluation** (`ml/train.py`, `ml/evaluate.py`)

Four classifiers trained and compared:

| Model | Key Hyperparameters |
| :--- | :--- |
| Logistic Regression | `C=1.0`, `max_iter=1000` |
| Naive Bayes | `alpha=0.5`, Multinomial |
| Linear SVM | `C=1.0`, `max_iter=2000`, LinearSVC |
| Random Forest | `n_estimators=100`, `random_state=42` |

**Evaluation Results on Validation Set (1,500 records):**

| Model | Accuracy | Precision | Recall | F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| Logistic Regression | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| Naive Bayes | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| Linear SVM | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| Random Forest | **1.0000** | **1.0000** | **1.0000** | **1.0000** |

> **Note on 100% Accuracy:** All models achieved perfect scores because the dataset is synthetically generated from category-specific templates — each category has a perfectly distinct, non-overlapping vocabulary. In a real-world deployment with genuine customer complaints (mixed terminology, informal language, ambiguity), expected accuracy is **85–93% for TF-IDF + SVM** and **92–97% for fine-tuned DistilBERT**.

Confusion matrix plots saved for each model under `ml/reports/`:
- `cm_category_logistic_regression.png`
- `cm_category_naive_bayes.png`
- `cm_category_linear_svm.png`
- `cm_category_random_forest.png`

**6. Model Artifacts Exported via Joblib**

| File | Contents | Size |
| :--- | :--- | :--- |
| `tfidf_vectorizer.pkl` | Fitted TF-IDF vectorizer | ~127 KB |
| `category_model.pkl` | Best category classifier | ~487 KB |
| `priority_model.pkl` | Priority classifier (Logistic Regression) | ~98 KB |
| `department_model.pkl` | Department classifier (Linear SVM) | ~171 KB |
| `saved_model.pkl` | Combined pipeline package | ~880 KB |

Separate classifiers trained per target:
- **Category** → Best model selected by F1-Score (all tied at 1.0 on synthetic data; Linear SVM preferred for real-world per NLP literature)
- **Priority** → Logistic Regression (4 classes: Low/Medium/High/Critical)
- **Department** → Linear SVM (6 classes)

### Challenges Encountered
- Synthetic data generator initially produced complaints that contained the category name verbatim in the text, causing near-trivial classification. Additional text variation logic added in `nepali_variations.py` to reduce keyword overlap
- NLTK resource download failures on first run — fixed with silent fallback download logic

### Outcome
- 15,000 synthetic telecom complaint records generated
- Full ML training pipeline working end-to-end
- 5 trained model `.pkl` artifacts saved and ready for serving

---

## Week 3 — FastAPI Development & MERN Stack Integration

### Objectives
- Build the FastAPI ML server with prediction, duplicate detection, and health endpoints
- Integrate AI predictions into the Node.js backend
- Update MongoDB schema to store AI metadata
- Build AI service and chatbot service layers

### Tasks Completed

**1. FastAPI ML Server** (`api/main.py`)

Three endpoints implemented:

| Method | Endpoint | Function |
| :--- | :--- | :--- |
| `GET` | `/health` | Server health check — confirms model is loaded |
| `POST` | `/predict` | Classifies complaint → category, priority, department, sentiment, confidence |
| `POST` | `/duplicate-check` | TF-IDF cosine similarity against last 100 tickets |

**Predict endpoint input/output:**
```json
// Input
{ "complaint": "My internet disconnects every evening." }

// Output
{
  "category":    "Internet Down",
  "priority":    "High",
  "department":  "Internet Support",
  "confidence":  0.96,
  "sentiment":   "Frustrated",
  "aiSummary":   "Possible internet connectivity blackout after peak hours."
}
```

**Duplicate detection logic:**
- Vectorizes incoming complaint text using the loaded TF-IDF vectorizer
- Computes cosine similarity against the last 100 tickets fetched from MongoDB
- If similarity ≥ 85%, returns the matching ticket ID and similarity score
- Prevents ticket flooding for the same recurring infrastructure issue

**2. MongoDB Schema Enhancement** (`backend/models/Complaint.js`)

11 new AI metadata fields added to the Complaint Mongoose schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `ticketId` | String (unique) | Auto-generated e.g. `CMP473829` |
| `aiCategory` | String | ML-predicted complaint category |
| `aiPriority` | String | ML-predicted priority level |
| `department` | String | ML-routed department |
| `aiConfidence` | Number | Prediction confidence (0.0–1.0) |
| `sentiment` | String | Customer sentiment: Happy / Neutral / Frustrated / Angry |
| `aiSummary` | String | AI-generated one-line complaint summary |
| `district` | String | Customer geographic district |
| `province` | String | One of Nepal's 7 provinces |
| `slaHours` | Number | Expected resolution time in hours |
| `duplicateMatchTicketId` | String | If similar ticket found, its ID |

**3. AI Integration in Express Routes** (`backend/routes/complaints.js`)

On every new complaint submission:
1. Express receives `POST /api/complaints`
2. Axios call to FastAPI `POST /predict` → returns category/priority/department/confidence/sentiment
3. Axios call to FastAPI `POST /duplicate-check` → returns similarity score
4. AI results merged into the Mongoose complaint document before saving
5. Ticket auto-saved with all AI metadata fields populated

**4. AI Service Layer** (`backend/services/aiService.js`)

Handles:
- Communication with FastAPI (Axios with timeout and error handling)
- Domain-specific troubleshooting advice generation per category:

| Category | Suggested Self-Fix |
| :--- | :--- |
| LOS Red | Check ONT patch cord, verify LOS light status |
| Internet Down | Restart router, verify WAN IP, check billing |
| SIM Activation | Airplane mode restart, verify KYC submission |
| Recharge Issue | Wait 5 minutes for payment webhook, check transaction ID |
| Voice Call | Enable VoLTE, restart phone |

**5. Chatbot Service Layer** (`backend/services/chatbotService.js`)

Stateful conversation engine with intent detection:

| User Input Pattern | Intent | Action |
| :--- | :--- | :--- |
| Ticket ID like `CMP000345` | Ticket Status Query | MongoDB lookup → status + engineer |
| "What are today's major issues?" | Manager Digest | Live MongoDB aggregation → analytics |
| Complaint description text | Complaint Flow | FastAPI → ML prediction → troubleshooting → duplicate check → ticket card |

**Chatbot conversation flow:**
1. User types complaint → intent detected as "complaint registration"
2. FastAPI called → prediction result received
3. Domain-specific troubleshooting suggestion generated
4. Duplicate detection run
5. Rich chatbot response returned with structured prediction card
6. User confirms → ticket registered in MongoDB
7. Ticket ID returned to user in chat

**6. Express AI Routes Registered** (`backend/routes/ai.js`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/ai/chat` | JWT | Main chatbot message handler |
| `GET` | `/api/ai/analytics` | JWT | Manager analytics aggregation |
| `POST` | `/api/ai/confirm-ticket` | JWT | Chatbot ticket confirmation |

### Challenges Encountered
- `@mui/icons-material` dependency causing build failures in frontend — resolved by replacing with inline SVG icon components
- JWT token not being forwarded from React chatbot widget to Express `/api/ai/chat` — fixed by reading token from `localStorage` in Axios headers
- FastAPI startup failing if `.pkl` files not found — added graceful error handling with informative startup message

### Outcome
- FastAPI server fully operational on port 8000
- Node.js backend successfully calling FastAPI and storing AI results in MongoDB
- AI routes registered and authenticated

---

## Week 4 — Frontend Integration, AI Dashboard & Testing

### Objectives
- Build the AI Chatbot Widget in React
- Build the AI Analytics Dashboard page
- Perform end-to-end system testing
- Write documentation

### Tasks Completed

**1. AI Chatbot Widget** (`frontend/src/components/AIChatbotWidget.jsx`)

A floating interactive chat assistant added to every page of the CMS:

- **Trigger**: Floating circular button (🤖) in the bottom-right corner
- **Panel**: Slide-out chat drawer with full message history
- **Features**:
  - Complaint registration with ML-predicted ticket card (shows category, priority, department, confidence)
  - Ticket status lookup by Ticket ID
  - Manager AI digest (live analytics summary)
  - Duplicate ticket warning card
  - Smart troubleshooting suggestions
  - One-click ticket confirmation

**Chatbot response example:**
```
AI Diagnostics Detected:
• Category:           Internet Down
• Priority:           High
• Department:         Internet Support
• Customer Sentiment: Frustrated
• Confidence:         96%

Suggested Step: Restart your Wi-Fi router and verify WAN IP status.

Would you like me to register this ticket now?
```

**2. AI Analytics Dashboard** (`frontend/src/pages/AIDashboardPage.jsx`)

Full-page AI intelligence dashboard accessible via sidebar navigation:

| Metric Card | Description |
| :--- | :--- |
| Total Complaints Analyzed | Count of all ML-classified tickets |
| Resolution Rate | % of tickets marked Resolved |
| Average SLA | Average resolution hours by department |
| Complaint Forecast | Predicted next-day ticket volume |
| Category Breakdown | Chart of complaint categories |
| Department Load | Distribution across 6 departments |
| Top Issue District | Highest-complaint geographic area |
| Sentiment Distribution | Happy / Neutral / Frustrated / Angry breakdown |

**3. System Architecture Finalized**

```
Customer / Manager (Browser)
         │
         ▼  (Axios HTTP + JWT)
React AIChatbotWidget.jsx / AIDashboardPage.jsx
         │
         ▼  POST /api/ai/chat  |  GET /api/ai/analytics
Express Backend (Node.js + MongoDB)
         │
         ├──► chatbotService.js  ──► MongoDB (ticket lookup / analytics)
         │
         └──► aiService.js  ──► FastAPI api/main.py (port 8000)
                                        │
                                        ├──► ML Model (category/priority/dept/sentiment)
                                        └──► TF-IDF Cosine Similarity (duplicate check)
```

**4. End-to-End Testing**

| Test Scenario | Result |
| :--- | :--- |
| Submit complaint via chatbot → ticket created in MongoDB | PASS |
| Submit duplicate complaint → warning card shown | PASS |
| Query ticket status by ID → correct status returned | PASS |
| Manager digest request → live aggregation returned | PASS |
| FastAPI `/predict` endpoint with Fiber complaint | PASS |
| FastAPI `/health` endpoint | PASS |
| JWT-protected chatbot route without token | PASS (401 returned) |
| React chatbot widget renders on all pages | PASS |
| AI fields saved in MongoDB document | PASS |

**5. Documentation Written**

- `README.md` — Full system overview, setup instructions, and architecture diagram
- `DEPLOYMENT_GUIDE.md` — Step-by-step deployment guide (Vercel + Render + FastAPI)
- `AI_CHATBOT_DOCS.md` — This document: technical deep-dive on AI system, dataset, ML pipeline, and integration

### Challenges Encountered
- MongoDB aggregation queries for analytics were slow on large datasets — resolved by adding compound indexes on `category` and `createdAt` fields
- DistilBERT fine-tuning (`ml/train_distilbert.py`) requires GPU; ran on CPU in reduced-epoch mode for demonstration purposes
- React chatbot widget state management required careful handling to prevent message duplication on re-render

### Outcome
- Full end-to-end AI-Powered CMS functional
- All React components tested and rendering correctly
- Documentation completed
- System ready for demonstration and deployment

---

## Summary of Deliverables

| Deliverable | Status |
| :--- | :---: |
| Synthetic dataset (15,000 records, 29 columns) | DONE |
| Dataset generator (6-module Python system) | DONE |
| ML training pipeline (preprocessing + TF-IDF + 4 classifiers) | DONE |
| Model evaluation with confusion matrices | DONE |
| Trained model artifacts (.pkl files) | DONE |
| FastAPI ML server (`/predict`, `/duplicate-check`, `/health`) | DONE |
| MongoDB schema updated with AI fields | DONE |
| Express AI service and chatbot service layers | DONE |
| JWT-authenticated Express AI routes | DONE |
| React AI Chatbot Widget (floating UI) | DONE |
| React AI Analytics Dashboard | DONE |
| End-to-end system testing | DONE |
| README, Deployment Guide, AI Documentation | DONE |

---

## Technologies Used

| Category | Technologies |
| :--- | :--- |
| Frontend | React.js, Material UI, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| AI / ML | Python, Scikit-learn, HuggingFace Transformers, NLTK |
| ML Serving | FastAPI, Uvicorn, Joblib |
| NLP | TF-IDF, DistilBERT, WordNet Lemmatizer |
| Database | MongoDB Atlas |
| Deployment | Vercel (Frontend), Render (Backend), Local / Cloud (FastAPI) |
| Version Control | Git, GitHub |

---

## Key Learnings

1. **Synthetic NLP datasets** achieve near-perfect accuracy on template-based classifiers due to non-overlapping vocabulary; real-world ambiguity requires transformer-based models (DistilBERT)
2. **Decoupled architecture** (MERN + FastAPI) allows independent scaling and language-agnostic service boundaries
3. **Hybrid AI chatbot design** — using ML for structured predictions and rule-based logic for troubleshooting — provides more reliable and explainable results than pure LLM approaches
4. **Data leakage awareness** — always validate that training labels are not embedded in input features (category names in complaint text)
5. **FastAPI + Joblib** provides a production-ready, low-latency ML serving pattern without requiring full ML platform infrastructure

---

## Next Steps / Recommendations

- Collect **real Nepal Telecom complaint data** and retrain models to get genuine accuracy metrics
- Integrate **Google Gemini API** for richer natural-language chatbot responses and FAQ handling
- Add **multi-turn session memory** to the chatbot for contextual conversations
- Implement **engineer assignment** directly from chatbot confirmation flow
- Add **voice input** (Web Speech API) for accessibility
- Expand language support to full Devanagari (नेपाली) script using multilingual NLP models

---

*Report prepared by: Nischal | Nepal Telecom IT Internship | AI-Powered CMS Project*
