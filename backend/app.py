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
from sklearn.preprocessing import StandardScaler
import joblib
import io
import base64
import tempfile


app = Flask(__name__)
CORS(app)


UPLOAD_PATH = r'D:\fraud-detection\backend\uploaded_data.csv'
MODEL_PATH = r'D:\fraud-detection\backend\model\xgboost_model.pkl'
SCALER_PATH = r'D:\fraud-detection\backend\model\scaler.pkl'

# # Load model and scaler once
# models_path = r'D:\fraud-detection\backend\model'
# with open(os.path.join(models_path, 'xgboost_model.pkl'), 'rb') as f:
#     model = pickle.load(f)

# with open(os.path.join(models_path, 'scaler.pkl'), 'rb') as f:
#     scaler = pickle.load(f)

@app.route('/predict-csv', methods=['POST'])
def predict_csv():
    try:
        # Load files
        model = joblib.load(r'D:\fraud-detection\backend\model\xgboost_model.pkl')
        scaler = joblib.load(r'D:\fraud-detection\backend\model\scaler.pkl')
        feature_columns = joblib.load(r'D:\fraud-detection\backend\model\feature_columns.pkl')

        # Get uploaded CSV
        file = request.files['file']
        df = pd.read_csv(file)
        
        # 🆕 SAVE THE UPLOADED CSV FOR VISUALIZATION
        df.to_csv(UPLOAD_PATH, index=False)

        # Drop 'Class' if it exists (only for prediction)
        if 'Class' in df.columns:
            df = df.drop('Class', axis=1)

        # Ensure same feature order
        df = df[feature_columns]

        # Scale input
        scaled_data = scaler.transform(df)

        # Get fraud probabilities
        fraud_probabilities = model.predict_proba(scaled_data)[:, 1]
        
        # Use optimal threshold
        optimal_threshold = 0.00001  # Your working threshold
        predictions = (fraud_probabilities > optimal_threshold).astype(int)

        # After making predictions in /predict-csv route:
        df['Class'] = predictions  # Add predictions as new column

        df.to_csv(UPLOAD_PATH, index=False)  # Save CSV for visualization

        
        num_fraud = int((predictions == 1).sum())
        num_non_fraud = int((predictions == 0).sum())

        return jsonify({
            'predictions': predictions.tolist(),
            'probabilities': fraud_probabilities.tolist(),
            'threshold_used': optimal_threshold,
            'num_fraud': num_fraud,
            'num_non_fraud': num_non_fraud
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/get-csv-data', methods=['GET'])
def get_csv_data():
    if not os.path.exists(UPLOAD_PATH):
        return jsonify({'error': 'CSV file not found'}), 404

    try:
        df = pd.read_csv(UPLOAD_PATH)
        return df.to_json(orient='records')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

FEATURE_COLUMNS_PATH = r'D:\fraud-detection\backend\model\feature_columns.pkl'  # ✅ fixed

@app.route('/explain-csv', methods=['POST'])
def explain_csv():
    try:
        model = joblib.load(r'D:\fraud-detection\backend\model\xgboost_model.pkl')
        scaler = joblib.load(r'D:\fraud-detection\backend\model\scaler.pkl')
        feature_columns = joblib.load(r'D:\fraud-detection\backend\model\feature_columns.pkl')

        file = request.files['file']
        df = pd.read_csv(file)

        if "Class" in df.columns:
            df = df.drop("Class", axis=1)

        df = df[feature_columns]
        scaled_data = scaler.transform(df)
        scaled_df = pd.DataFrame(scaled_data, columns=feature_columns)

        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(scaled_df)

        rowwise_explanations = []

        for i in range(min(len(scaled_df), 20)):
            pred = model.predict([scaled_df.iloc[i]])[0]
            pred_label = "Fraud" if pred == 1 else "Not Fraud"

            # Create dict of feature contributions
            feature_contribs = {
                feature: float(shap_values[i][j])
                for j, feature in enumerate(feature_columns)
            }

            rowwise_explanations.append({
                "row": i + 1,
                "prediction": pred_label,
                "contributions": feature_contribs
            })

        return jsonify({"rows": rowwise_explanations})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)