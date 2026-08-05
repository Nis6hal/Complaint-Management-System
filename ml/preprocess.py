"""
Text Preprocessing, Stopwords Removal, Lemmatization, and TF-IDF Vectorization
"""

import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer

# Download required NLTK resources silently
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Custom Nepali-English stopwords extension
CUSTOM_STOPWORDS = {
    'please', 'plz', 'ntc', 'sir', 'maam', 'ntc_support', 'urgent',
    'cha', 'chha', 'ko', 'ma', 'le', 'ra', 'bata', 'bhayena', 'bhyena', 'gardinus', 'gdnus'
}
stop_words.update(CUSTOM_STOPWORDS)

def clean_text(text: str) -> str:
    """
    Standard NLP text cleaning:
    1. Lowercasing
    2. Special character & digit removal
    3. Tokenization & Stop words removal
    4. WordNet Lemmatization
    """
    if not isinstance(text, str):
        return ""

    # Convert text to lowercase
    text = text.lower()

    # Remove URLs, email addresses, and phone numbers
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    text = re.sub(r'\d+', '', text)

    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))

    # Tokenize words
    words = text.split()

    # Filter stopwords and apply lemmatization
    cleaned_words = [
        lemmatizer.lemmatize(word) for word in words 
        if word not in stop_words and len(word) > 1
    ]

    return " ".join(cleaned_words)


def build_tfidf_vectorizer(max_features=5000, ngram_range=(1, 2)):
    """
    Builds a TF-IDF Vectorizer optimized for multi-word phrases.
    """
    return TfidfVectorizer(
        max_features=max_features,
        ngram_range=ngram_range,
        sublinear_tf=True
    )
