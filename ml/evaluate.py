"""
Model Evaluation and Confusion Matrix Plotting Utility
"""

import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

def evaluate_classifier_models(models_dict, X_train, y_train, X_val, y_val, target_name="Category", output_dir="ml/reports"):
    """
    Evaluates multiple trained models on Accuracy, Precision, Recall, and F1 Score.
    Generates comparison tables and saves confusion matrix plots.
    """
    os.makedirs(output_dir, exist_ok=True)
    results = []

    print(f"\n=======================================================")
    print(f" EVALUATION REPORT FOR TARGET: [{target_name.upper()}]")
    print(f"=======================================================")

    for name, model in models_dict.items():
        # Fit model on training data
        model.fit(X_train, y_train)
        preds = model.predict(X_val)

        acc = accuracy_score(y_val, preds)
        precision, recall, f1, _ = precision_recall_fscore_support(y_val, preds, average='weighted', zero_division=0)

        results.append({
            "Model": name,
            "Accuracy": acc,
            "Precision": precision,
            "Recall": recall,
            "F1-Score": f1
        })

        # Save confusion matrix plot for best performing or each model
        cm = confusion_matrix(y_val, preds)
        plt.figure(figsize=(10, 8))
        labels = sorted(list(set(y_val)))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=labels, yticklabels=labels)
        plt.title(f"Confusion Matrix: {name} ({target_name})")
        plt.xlabel("Predicted Label")
        plt.ylabel("True Label")
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        
        plot_path = os.path.join(output_dir, f"cm_{target_name.lower()}_{name.lower().replace(' ', '_')}.png")
        plt.savefig(plot_path)
        plt.close()

    results_df = pd.DataFrame(results).sort_values(by="F1-Score", ascending=False)
    print(results_df.to_string(index=False))

    best_model_name = results_df.iloc[0]["Model"]
    print(f"\n[*] Selected Best Model for [{target_name}]: {best_model_name}")

    return results_df, models_dict[best_model_name]
