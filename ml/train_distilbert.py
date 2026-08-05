"""
DistilBERT Fine-Tuning Module for Production Complaint Classification
"""

import os
import torch
import pandas as pd
import numpy as np
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.preprocessing import LabelEncoder

class ComplaintDataset(torch.utils.data.Dataset):
    def __init__(self, encodings, labels=None):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encodings.items()}
        if self.labels is not None:
            item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.encodings['input_ids'])

def train_distilbert(dataset_dir="dataset", save_dir="ml/saved_models/distilbert"):
    print("[*] Preparing DistilBERT fine-tuning pipeline...")
    train_df = pd.read_csv(os.path.join(dataset_dir, "train.csv"))
    val_df = pd.read_csv(os.path.join(dataset_dir, "validation.csv"))

    # Label Encoding
    label_encoder = LabelEncoder()
    train_labels = label_encoder.fit_transform(train_df["Category"])
    val_labels = label_encoder.transform(val_df["Category"])

    # Save Label Encoder
    import joblib
    os.makedirs(save_dir, exist_ok=True)
    joblib.dump(label_encoder, os.path.join(save_dir, "label_encoder.pkl"))

    # Tokenizer
    model_name = "distilbert-base-uncased"
    tokenizer = DistilBertTokenizer.from_pretrained(model_name)

    train_encodings = tokenizer(list(train_df["ComplaintText"]), truncation=True, padding=True, max_length=128)
    val_encodings = tokenizer(list(val_df["ComplaintText"]), truncation=True, padding=True, max_length=128)

    train_dataset = ComplaintDataset(train_encodings, train_labels)
    val_dataset = ComplaintDataset(val_encodings, val_labels)

    # Model
    model = DistilBertForSequenceClassification.from_pretrained(
        model_name,
        num_labels=len(label_encoder.classes_)
    )

    training_args = TrainingArguments(
        output_dir=os.path.join(save_dir, "results"),
        num_train_epochs=1,  # 1 Epoch fast fine-tune for production deployment
        per_device_train_batch_size=16,
        per_device_eval_batch_size=32,
        warmup_steps=100,
        weight_decay=0.01,
        logging_dir=os.path.join(save_dir, "logs"),
        logging_steps=50,
        eval_strategy="epoch",
        save_strategy="epoch"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset
    )

    print("[*] Fine-tuning DistilBERT on dataset...")
    trainer.train()

    print("[*] Saving fine-tuned DistilBERT model and tokenizer...")
    model.save_pretrained(save_dir)
    tokenizer.save_pretrained(save_dir)
    print(f"[SUCCESS] DistilBERT production model saved to: {save_dir}")

if __name__ == "__main__":
    train_distilbert()
