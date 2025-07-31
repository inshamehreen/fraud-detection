import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load your saved model
with open(r'D:\fraud-detection\backend\model\xgboost_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
