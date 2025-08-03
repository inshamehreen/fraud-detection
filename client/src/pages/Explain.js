import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Explain = () => {
  const [file, setFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [summaryImage, setSummaryImage] = useState('');
  const [comparisonImage, setComparisonImage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/explain-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setHtmlContent(response.data.html_content);
      setSummaryImage(response.data.summary_plot);
      setComparisonImage(response.data.comparison_plot);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-black font-rubik px-4 py-10">
      <motion.div
        className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-slab text-secondary mb-6 animate-slide-in-down">
          📊 SHAP Explanation Dashboard
        </h1>

        <p className="text-md mb-6">
          SHAP (SHapley Additive exPlanations) helps interpret why the model flagged a transaction as fraudulent. It assigns contribution values to each feature for every prediction, revealing what influenced the model’s decision.
        </p>

        <h2 className="text-xl font-slab text-secondary mb-2 animate-slide-in-left">
          💡 How do SHAP values work?
        </h2>

        <ul className="list-disc list-inside mb-4">
          <li><b>👉 Positive contribution</b> → pushes the model toward predicting fraud.</li>
          <li><b>👉 Negative contribution</b> → pushes it toward predicting non-fraud.</li>
        </ul>

        <p className="italic text-gray-600 mb-6">E.g., a high amount at odd hours could increase suspicion.</p>

        <input type="file" onChange={handleFileChange} className="mb-4" />
        <br />
        <button
          onClick={handleUpload}
          className="bg-primary text-white px-5 py-2 rounded-md hover:bg-secondary transition duration-300 animate-pulse"
        >
          Upload and Explain
        </button>

        {htmlContent && (
          <div className="mt-10">
            <h2 className="text-xl font-slab text-highlight mb-2 animate-slide-in-up">
              🔍 Prediction Explanations
            </h2>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        )}

        {summaryImage && (
          <div className="mt-10">
            <h2 className="text-xl font-slab text-highlight mb-2 animate-slide-in-up">
              📌 SHAP Summary Plot
            </h2>
            <img src={`data:image/png;base64,${summaryImage}`} alt="SHAP Summary Plot" className="rounded shadow-md" />
          </div>
        )}

        {comparisonImage && (
          <div className="mt-10">
            <h2 className="text-xl font-slab text-highlight mb-2 animate-slide-in-up">
              ⚖️ Fraud vs Non-Fraud Comparison
            </h2>
            <img src={`data:image/png;base64,${comparisonImage}`} alt="SHAP Comparison Plot" className="rounded shadow-md" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Explain;
