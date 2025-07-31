// src/components/CsvUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function CsvUpload() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPredictions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert('Please select a file first');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/predict-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPredictions(res.data.predictions);
    } catch (error) {
      alert('Upload failed or prediction failed');
      console.error(error);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload CSV for Prediction</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Predict</button>
      </form>

      {predictions.length > 0 && (
        <div className="results">
          <h3>Predictions</h3>
          <ul>
            {predictions.map((pred, idx) => (
              <li key={idx}>Row {idx + 1}: {pred === 0 ? 'Not Fraud' : 'Fraud'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CsvUpload;
