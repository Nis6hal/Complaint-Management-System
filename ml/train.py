"""
Training Script for Multi-Model Comparison & Joblib Model Artifact Export
"""

import os
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder

from ml.preprocess import clean_text, build_tfidf_vectorizer
from ml.evaluate import evaluate_classifier_models

def train_and_save_pipeline(dataset_dir="dataset", save_dir="ml/saved_models"):
    os.makedirs(save_dir, exist_ok=True)

    train_path = os.path.join(dataset_dir, "train.csv")
    val_path = os.path.join(dataset_dir, "validation.csv")

    if not os.path.exists(train_path):
        print(f"[!] {train_path} not found. Generating dataset first...")
        from dataset_generator.generator import generate_dataset
        generate_dataset(15000, output_dir=dataset_dir)

    print("[*] Loading train and validation datasets...")
    train_df = pd.read_csv(train_path)
    val_df = pd.read_csv(val_path)

    # Apply text cleaning, stop word removal & lemmatization
    print("[*] Cleaning text data (removing stop words & applying lemmatization)...")
    train_df["cleaned_text"] = train_df["ComplaintText"].apply(clean_text)
    val_df["cleaned_text"] = val_df["ComplaintText"].apply(clean_text)

    # Build and fit TF-IDF Vectorizer
    print("[*] Vectorizing text with TF-IDF...")
    vectorizer = build_tfidf_vectorizer(max_features=5000)
    X_train = vectorizer.fit_transform(train_df["cleaned_text"])
    X_val = vectorizer.transform(val_df["cleaned_text"])

    # Define candidate models to evaluate
    models_config = {
        "Logistic Regression": LogisticRegression(max_iter=1000, C=1.0),
        "Naive Bayes": MultinomialNB(alpha=0.5),
        "Linear SVM": LinearSVC(C=1.0, max_iter=2000),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    }

    # Evaluate models on primary target: Category
    print("\n[+] Training & Evaluating Candidate Models on Category Prediction...")
    category_results, best_category_model = evaluate_classifier_models(
        models_config, X_train, train_df["Category"], X_val, val_df["Category"], target_name="Category"
    )

    # Train Priority Model (Using Linear SVC / Logistic Regression)
    print("\n[+] Training Priority Prediction Model...")
    priority_model = LogisticRegression(max_iter=1000)
    priority_model.fit(X_train, train_df["Priority"])

    # Train Department Model (Using Linear SVC / Logistic Regression)
    print("\n[+] Training Department Prediction Model...")
    department_model = LinearSVC(C=1.0, max_iter=2000)
    department_model.fit(X_train, train_df["Department"])

    # Save trained model artifacts and vectorizer using joblib
    print("\n[*] Exporting trained model artifacts via Joblib...")
    joblib.dump(vectorizer, os.path.join(save_dir, "tfidf_vectorizer.pkl"))
    joblib.dump(best_category_model, os.path.join(save_dir, "category_model.pkl"))
    joblib.dump(priority_model, os.path.join(save_dir, "priority_model.pkl"))
    joblib.dump(department_model, os.path.join(save_dir, "department_model.pkl"))
    
    # Save a combined package for quick production inference
    pipeline_package = {
        "vectorizer": vectorizer,
        "category_model": best_category_model,
        "priority_model": priority_model,
        "department_model": department_model
    }
    joblib.dump(pipeline_package, os.path.join(save_dir, "saved_model.pkl"))
    joblib.dump(pipeline_package, "ml/saved_model.pkl")  # also root of ml directory as per structure spec

    print(f"[SUCCESS] All model artifacts successfully saved to '{save_dir}' and 'ml/saved_model.pkl'")

if __name__ == "__main__":
    train_and_save_pipeline()
