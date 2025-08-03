import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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

  const getReason = (value) => {
    return value === 1
      ? 'Flagged due to unusual amount, risky location or time anomaly.'
      : 'Transaction shows no significant anomalies.';
  };

  const handleDownload = () => {
    const csvRows = [
      ['Row', 'Prediction', 'Reason'],
      ...predictions.map((pred, idx) => [
        idx + 1,
        pred === 0 ? 'Not Fraud' : 'Fraud',
        getReason(pred),
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'predictions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#113F67] text-[#FDF5AA] font-rubik p-6 flex flex-col items-center">
      <motion.h2
        className="text-3xl font-slab mb-6 text-[#FDF5AA]"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Upload CSV for Prediction
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-[#34699A] p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="text-white file:bg-[#58A0C8] file:text-white file:rounded file:px-4 file:py-2"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-[#FDF5AA] text-[#113F67] font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Predict
        </motion.button>
      </motion.form>

      {predictions.length > 0 && (
        <motion.div
          className="mt-8 w-full max-w-md bg-[#58A0C8] p-4 rounded shadow-md text-white"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-slab mb-4">Predictions</h3>
          <ul className="list-disc pl-5 space-y-4 text-sm">
            {predictions.map((pred, idx) => (
              <li key={idx}>
                <div>
                  <strong>Row {idx + 1}:</strong> {pred === 0 ? 'Not Fraud' : 'Fraud'}
                </div>
                <div className="text-yellow-100 italic">
                  Reason: {getReason(pred)}
                </div>
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="mt-6 w-full bg-yellow-300 text-[#113F67] font-bold py-2 rounded hover:bg-yellow-200 transition"
          >
            Download Predictions
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default CsvUpload;
