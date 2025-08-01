import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function ModelChart({ algo }) {
  const chartData = {
    labels: ['Precision', 'Recall', 'F1-Score'],
    datasets: [
      {
        label: algo,
        data: generateRandomMetrics(algo),
        backgroundColor: ['#FDF5A9', '#F4E2D8', '#EED6C4'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  function generateRandomMetrics(name) {
    const baseMetrics = {
      'Logistic Regression': [0.82, 0.68, 0.74],
      'Decision Tree': [0.75, 0.72, 0.73],
      'Random Forest': [0.89, 0.81, 0.85],
      'Support Vector Machine (SVM)': [0.83, 0.77, 0.80],
      'XGBoost': [0.91, 0.88, 0.89],
    };
    return baseMetrics[name] || [0.7, 0.7, 0.7];
  }

  

  return (
    <div className="h-56 w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default ModelChart;
