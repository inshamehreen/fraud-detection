// pages/CsvUpload.js
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
    <div className="min-h-screen bg-[#113F67] text-[#FDF5AA] font-rubik p-6 flex flex-col items-center">
      <h2 className="text-3xl font-slab mb-6 text-[#FDF5AA]">Upload CSV for Prediction</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[#34699A] p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="text-white file:bg-[#58A0C8] file:text-white file:rounded file:px-4 file:py-2"
        />
        <button
          type="submit"
          className="bg-[#FDF5AA] text-[#113F67] font-bold px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Predict
        </button>
      </form>

      {predictions.length > 0 && (
        <div className="mt-8 w-full max-w-md bg-[#58A0C8] p-4 rounded shadow-md text-white">
          <h3 className="text-xl font-slab mb-4">Predictions</h3>
          <ul className="list-disc pl-5 space-y-2">
            {predictions.map((pred, idx) => (
              <li key={idx}>
                Row {idx + 1}: {pred === 0 ? 'Not Fraud' : 'Fraud'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CsvUpload;
