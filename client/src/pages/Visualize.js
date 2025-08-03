import React, { useState, useEffect } from 'react';
import ChartDisplay from '../components/ChartDisplay';
import { motion } from 'framer-motion';
import axios from 'axios';

function Visualize() {
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  // Fetch CSV data from Flask
  useEffect(() => {
    axios
      .get('http://localhost:5000/get-csv-data')
      .then((response) => {
        const data = response.data;

        // Count fraud vs normal
        const fraudCount = data.filter((row) => row.Class === 1).length;
        const normalCount = data.filter((row) => row.Class === 0).length;

        const updatedChartData = {
          labels: ['Normal', 'Fraudulent'],
          datasets: [
            {
              label: 'Transaction Count',
              data: [normalCount, fraudCount],
              backgroundColor: ['#58a0c8', '#fdf5aa'],
              borderColor: ['#113f67', '#34699a'],
              borderWidth: 2,
            },
          ],
        };

        setChartData(updatedChartData);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load CSV data. Please upload a CSV first.');
      });
  }, []);

  const toggleChartType = () => {
    setChartType((prev) => (prev === 'bar' ? 'line' : 'bar'));
  };

  return (
    <div className="min-h-screen bg-[#113f67] text-white font-rubik p-6 flex flex-col items-center">
      <h2 className="text-3xl font-alfa mb-6 text-center">Data Visualization</h2>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <button
          onClick={toggleChartType}
          className="bg-[#34699a] hover:bg-[#58a0c8] text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Switch to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4 max-w-xl text-center">
          {error}
        </div>
      )}

      {chartData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl bg-[#fdf5aa] rounded-lg shadow-lg p-4"
        >
          <ChartDisplay chartType={chartType} chartData={chartData} />
        </motion.div>
      )}
    </div>
  );
}

export default Visualize;
