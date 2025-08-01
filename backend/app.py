from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import shap
import os
import uuid
import xgboost as xgb

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

    if 'Class' in df.columns:
        df = df.drop(columns=['Class'])

    # Compute SHAP values
    shap_values = explainer(df)

    # Create a folder to store HTML files
    output_dir = os.path.join("shap_htmls", str(uuid.uuid4()))
    os.makedirs(output_dir, exist_ok=True)

    html_files = []

    for i in range(len(df)):
        output_path = os.path.join(output_dir, f"shap_{i}.html")
        shap_html = shap.plots.force(shap_values[i], matplotlib=False, show=False)
        shap.save_html(output_path, shap_html)
        web_path = output_path.replace('\\', '/')
        html_files.append(f"http://localhost:5000/{web_path}")


    return jsonify({'shap_htmls': html_files})

# Serve HTML files
@app.route('/shap_htmls/<path:filename>')
def serve_html(filename):
    return send_file(f"shap_htmls/{filename}")

if __name__ == '__main__':
    app.run(debug=True)
