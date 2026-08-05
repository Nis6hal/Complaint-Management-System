"""
Inference & Prediction Utility Module
"""

import os
import joblib
import numpy as np
from ml.preprocess import clean_text

class ComplaintPredictor:
    def __init__(self, model_path="ml/saved_model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Saved model artifact not found at '{model_path}'. Please run ml/train.py first.")
        
        package = joblib.load(model_path)
        self.vectorizer = package["vectorizer"]
        self.category_model = package["category_model"]
        self.priority_model = package["priority_model"]
        self.department_model = package["department_model"]

    def predict(self, complaint_text: str):
        cleaned = clean_text(complaint_text)
        features = self.vectorizer.transform([cleaned])

        category_pred = self.category_model.predict(features)[0]
        priority_pred = self.priority_model.predict(features)[0]
        department_pred = self.department_model.predict(features)[0]

        # Calculate prediction confidence
        confidence = 0.95
        if hasattr(self.category_model, "predict_proba"):
            probas = self.category_model.predict_proba(features)[0]
            confidence = round(float(np.max(probas)), 2)
        elif hasattr(self.category_model, "decision_function"):
            decision_val = self.category_model.decision_function(features)
            # Softmax approximation over decision scores
            if decision_val.ndim > 1:
                e_x = np.exp(decision_val - np.max(decision_val))
                probs = e_x / e_x.sum(axis=1, keepdims=True)
                confidence = round(float(np.max(probs)), 2)

        return {
            "category": str(category_pred),
            "priority": str(priority_pred),
            "department": str(department_pred),
            "confidence": confidence
        }

if __name__ == "__main__":
    predictor = ComplaintPredictor()
    sample = "My internet disconnects after rain."
    result = predictor.predict(sample)
    print(f"Sample Input: '{sample}'")
    print(f"Prediction Result: {result}")
