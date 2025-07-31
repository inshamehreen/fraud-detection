from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import logging

app = Flask(__name__)
app.debug = True
logging.basicConfig(level=logging.DEBUG)

CORS(app)  # <-- Enables CORS for all origins (or you can restrict if needed)

# Load your saved model
with open(r'D:\fraud-detection\backend\model\xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})

@app.route('/predict-csv', methods=['POST'])
def predict_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        df = pd.read_csv(file)

        if 'Class' in df.columns:
            df = df.drop(columns=['Class'])

        predictions = model.predict(df)

        return jsonify({'predictions': predictions.tolist()})

    except Exception as e:
        return jsonify({'error': f'Failed to process the file: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
