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


@app.route('/explain-csv', methods=['POST'])
def explain_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    df = pd.read_csv(file)

    # Save uploaded file for reuse
    os.makedirs('uploads', exist_ok=True)
    df.to_csv(UPLOAD_PATH, index=False)

    has_label = False
    if 'Class' in df.columns:
        labels = df['Class']
        has_label = True
        df = df.drop(columns=['Class'])
    else:
        labels = None

    # Compute SHAP values
    shap_values = explainer(df)

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

        top_indices = np.argsort(np.abs(shap_values[i].values))[-3:]
        explanation = ", ".join(
            f"{df.columns[j]} contributed {'positively' if shap_values[i].values[j] > 0 else 'negatively'}"
            for j in reversed(top_indices)
        )
        natural_explanations.append(f"Top contributing features: {explanation}.")

    summary_dir = "shap_plots"
    os.makedirs(summary_dir, exist_ok=True)
    summary_path = os.path.join(summary_dir, 'shap_summary.png')
    shap.plots.beeswarm(shap_values, show=False)
    plt.savefig(summary_path, bbox_inches='tight')
    plt.close()

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