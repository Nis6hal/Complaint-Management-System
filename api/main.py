"""
Enhanced Production FastAPI Server with Sentiment Analysis & Similarity Checking
"""

import sys
import os
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from sklearn.metrics.pairwise import cosine_similarity

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.preprocess import clean_text
from ml.predict_distilbert import DistilBertComplaintPredictor

app = FastAPI(
    title="Nepal Telecom Hybrid AI Engine API",
    description="FastAPI service serving ML models, sentiment scoring, duplicate similarity matching, and AI recommendations.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Schemas
class PredictRequest(BaseModel):
    complaint: str

class PredictResponse(BaseModel):
    category: str
    priority: str
    department: str
    confidence: float
    sentiment: str
    aiSummary: str

class DuplicateCheckRequest(BaseModel):
    newComplaint: str
    existingComplaints: List[dict] # List of {"ticketId": "...", "description": "..."}

class DuplicateCheckResponse(BaseModel):
    isDuplicate: bool
    similarityScore: float
    matchedTicketId: Optional[str] = None
    matchedDescription: Optional[str] = None

# Initialize Predictor Engine
model_path = os.path.join(os.path.dirname(__file__), "..", "ml", "saved_model.pkl")
predictor = DistilBertComplaintPredictor(fallback_path=model_path)

def derive_sentiment(priority: str, text: str) -> str:
    text_lower = text.lower()
    if any(word in text_lower for word in ["angry", "worst", "fraud", "useless", "suck", "terrible", "waste"]):
        return "Angry"
    if priority in ["Critical", "High"] or any(word in text_lower for word in ["slow", "down", "not working", "problem", "broken"]):
        return "Frustrated"
    if any(word in text_lower for word in ["thank", "good", "resolve"]):
        return "Happy"
    return "Neutral"

def generate_ai_summary(category: str, text: str) -> str:
    clean = text.strip().capitalize()
    if len(clean) > 80:
        clean = clean[:77] + "..."
    return f"Possible {category.lower()} issue: {clean}"

@app.get("/health")
def health():
    return {"status": "healthy", "service": "FastAPI Hybrid AI Engine"}

@app.post("/predict", response_model=PredictResponse)
def predict_complaint(request: PredictRequest):
    if not request.complaint.strip():
        raise HTTPException(status_code=400, detail="Complaint text cannot be empty.")

    res = predictor.predict(request.complaint)
    sentiment = derive_sentiment(res["priority"], request.complaint)
    ai_summary = generate_ai_summary(res["category"], request.complaint)

    return PredictResponse(
        category=res["category"],
        priority=res["priority"],
        department=res["department"],
        confidence=res["confidence"],
        sentiment=sentiment,
        aiSummary=ai_summary
    )

@app.post("/duplicate-check", response_model=DuplicateCheckResponse)
def check_duplicate(request: DuplicateCheckRequest):
    if not request.existingComplaints:
        return DuplicateCheckResponse(isDuplicate=False, similarityScore=0.0)

    # Calculate TF-IDF Cosine Similarity
    vectorizer = predictor.vectorizer
    new_vec = vectorizer.transform([clean_text(request.newComplaint)])
    
    existing_texts = [clean_text(item.get("description", "")) for item in request.existingComplaints]
    existing_vecs = vectorizer.transform(existing_texts)

    similarities = cosine_similarity(new_vec, existing_vecs)[0]
    max_idx = int(np.argmax(similarities))
    max_score = float(similarities[max_idx])

    if max_score >= 0.85: # 85%+ similarity threshold
        matched = request.existingComplaints[max_idx]
        return DuplicateCheckResponse(
            isDuplicate=True,
            similarityScore=round(max_score, 4),
            matchedTicketId=matched.get("ticketId", matched.get("_id")),
            matchedDescription=matched.get("description", "")
        )

    return DuplicateCheckResponse(isDuplicate=False, similarityScore=round(max_score, 4))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
