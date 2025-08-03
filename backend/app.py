from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import shap
import os
import uuid
import xgboost as xgb
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# Load model
with open(r'D:\fraud-detection\backend\model\xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

# SHAP explainer
explainer = shap.Explainer(model)

@app.route('/predict-csv', methods=['POST'])
def predict_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    df = pd.read_csv(file)

    if 'Class' in df.columns:
        df = df.drop(columns=['Class'])

    predictions = model.predict(df)
    return jsonify({'predictions': predictions.tolist()})


@app.route('/explain-csv', methods=['POST'])
def explain_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    df = pd.read_csv(file)

    # Drop target column if present
    has_label = False
    if 'Class' in df.columns:
        labels = df['Class']
        has_label = True
        df = df.drop(columns=['Class'])
    else:
        labels = None

    # Compute SHAP values
    shap_values = explainer(df)

    # Create directory
    output_dir = os.path.join("shap_htmls", str(uuid.uuid4()))
    os.makedirs(output_dir, exist_ok=True)

    shap_htmls = []
    natural_explanations = []

    for i in range(len(df)):
        output_path = os.path.join(output_dir, f"shap_{i}.html")
        shap_html = shap.plots.force(shap_values[i], matplotlib=False, show=False)
        shap.save_html(output_path, shap_html)

        web_path = output_path.replace("\\", "/")
        shap_htmls.append(f"http://localhost:5000/{web_path}")

        # Basic natural language explanation
        top_indices = np.argsort(np.abs(shap_values[i].values))[-3:]
        explanation = ", ".join(
            f"{df.columns[j]} contributed {'positively' if shap_values[i].values[j] > 0 else 'negatively'}"
            for j in reversed(top_indices)
        )
        natural_explanations.append(f"Top contributing features: {explanation}.")

    # SHAP summary plot
    summary_dir = "shap_plots"
    os.makedirs(summary_dir, exist_ok=True)
    summary_path = os.path.join(summary_dir, 'shap_summary.png')
    shap.plots.beeswarm(shap_values, show=False)
    plt.savefig(summary_path, bbox_inches='tight')
    plt.close()

    # Fraud vs Non-Fraud comparison
    compare_url = None
    if has_label:
        fraud_shap = shap_values.values[labels == 1].mean(axis=0)
        nonfraud_shap = shap_values.values[labels == 0].mean(axis=0)
        diff = fraud_shap - nonfraud_shap
        top_features = np.argsort(np.abs(diff))[-10:]

        plt.figure(figsize=(8, 5))
        plt.barh(range(len(top_features)), diff[top_features])
        plt.yticks(range(len(top_features)), [df.columns[i] for i in top_features])
        plt.xlabel("Avg SHAP(Fraud) - Avg SHAP(Non-Fraud)")
        plt.title("Feature Importance Contrast")
        compare_path = os.path.join(output_dir, "fraud_vs_nonfraud.png")
        plt.tight_layout()
        plt.savefig(compare_path)
        plt.close()
        compare_url = f"http://localhost:5000/{compare_path.replace(os.sep, '/')}"

    return jsonify({
        'shap_htmls': shap_htmls,
        'natural_explanations': natural_explanations,
        'summary_plot': f"http://localhost:5000/{summary_path.replace(os.sep, '/')}",
        'compare_plot': compare_url
    })


@app.route('/shap_htmls/<path:filename>')
def serve_html(filename):
    return send_file(f"shap_htmls/{filename}")


@app.route('/shap_plots/<path:filename>')
def serve_plot(filename):
    return send_file(f"shap_plots/{filename}")


if __name__ == '__main__':
    app.run(debug=True)
