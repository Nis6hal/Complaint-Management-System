"""
Real evaluation — removes leaky samples where Category name appears in text.
"""
import re, string, warnings
warnings.filterwarnings('ignore')

import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support

for r in ['stopwords', 'wordnet']:
    try: nltk.data.find(f'corpora/{r}')
    except LookupError: nltk.download(r, quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
CUSTOM = {'please','plz','ntc','sir','maam','urgent','cha','chha','ko','ma','le','ra','bata','bhayena','gdnus'}
stop_words.update(CUSTOM)

def clean_text(text):
    if not isinstance(text, str): return ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = text.split()
    return " ".join(lemmatizer.lemmatize(w) for w in words if w not in stop_words and len(w) > 1)

def has_leak(row):
    cat_words = str(row['Category']).lower().split()
    text_lower = str(row['ComplaintText']).lower()
    return any(w in text_lower for w in cat_words if len(w) > 3)

print("[*] Loading datasets...")
train_df = pd.read_csv("dataset/train.csv")
val_df   = pd.read_csv("dataset/validation.csv")

print(f"    Raw train: {len(train_df)}  |  Raw val: {len(val_df)}")

# Remove leaky samples
train_clean = train_df[~train_df.apply(has_leak, axis=1)].copy()
val_clean   = val_df[~val_df.apply(has_leak, axis=1)].copy()

print(f"    After leak removal - Train: {len(train_clean)}  |  Val: {len(val_clean)}")

print("[*] Cleaning text...")
train_clean["cleaned"] = train_clean["ComplaintText"].apply(clean_text)
val_clean["cleaned"]   = val_clean["ComplaintText"].apply(clean_text)

print("[*] TF-IDF vectorization...")
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), sublinear_tf=True)
X_train = vectorizer.fit_transform(train_clean["cleaned"])
X_val   = vectorizer.transform(val_clean["cleaned"])

y_train = train_clean["Category"]
y_val   = val_clean["Category"]

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, C=1.0),
    "Naive Bayes":         MultinomialNB(alpha=0.5),
    "Linear SVM":          LinearSVC(C=1.0, max_iter=2000),
    "Random Forest":       RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
}

print()
print("=" * 70)
print(f"  {'Model':<25} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1-Score':>10}")
print("=" * 70)

results = []
for name, model in models.items():
    print(f"  Training {name}...")
    model.fit(X_train, y_train)
    preds = model.predict(X_val)
    acc = accuracy_score(y_val, preds)
    p, r, f1, _ = precision_recall_fscore_support(y_val, preds, average='weighted', zero_division=0)
    results.append((name, acc, p, r, f1))
    print(f"  {name:<25} {acc:>10.4f} {p:>10.4f} {r:>10.4f} {f1:>10.4f}")

print("=" * 70)
best = max(results, key=lambda x: x[4])
print(f"\n  [BEST] {best[0]}  |  F1={best[4]:.4f}  |  Accuracy={best[1]:.4f}")
print("=" * 70)
