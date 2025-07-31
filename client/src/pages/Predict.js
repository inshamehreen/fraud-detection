import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Results from '../components/Results';

function Predict() {
  const [predictionResult, setPredictionResult] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload File for Prediction</h2>
      <UploadForm setPredictionResult={setPredictionResult} />
      {predictionResult && <Results data={predictionResult} />}
    </div>
  );
}

export default Predict;
