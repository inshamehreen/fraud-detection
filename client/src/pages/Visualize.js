import React, { useState } from 'react';
import ChartDisplay from '../components/ChartDisplay';

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
    <div className="p-6 min-h-screen bg-[#113f67] text-white font-rubik">
      <h2 className="text-3xl font-alfa mb-6">Data Visualization</h2>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
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

      <ChartDisplay chartType={chartType} chartData={chartData} />
    </div>
  );
}

export default Visualize;
