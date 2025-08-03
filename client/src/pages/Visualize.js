import React, { useState } from 'react';
import ChartDisplay from '../components/ChartDisplay';
import { motion } from 'framer-motion';

function Visualize() {
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState({
    labels: ['Normal', 'Fraudulent'],
    datasets: [
      {
        label: 'Transaction Count',
        data: [120, 30],
        backgroundColor: ['#58a0c8', '#fdf5aa'],
        borderColor: ['#113f67', '#34699a'],
        borderWidth: 2,
      },
    ],
  });

  const toggleChartType = () => {
    setChartType((prev) => (prev === 'bar' ? 'line' : 'bar'));
  };

  const updateData = () => {
    const newData = {
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: [
            Math.floor(Math.random() * 200),
            Math.floor(Math.random() * 100),
          ],
        },
      ],
    };
    setChartData(newData);
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

        <button
          onClick={updateData}
          className="bg-[#fdf5aa] hover:bg-yellow-300 text-[#113f67] font-semibold py-2 px-4 rounded transition duration-300"
        >
          Update Data
        </button>
      </div>

      {/* Animate Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl bg-[#fdf5aa] rounded-lg shadow-lg p-4"
      >
        <ChartDisplay chartType={chartType} chartData={chartData} />
      </motion.div>
    </div>
  );
}

export default Visualize;
