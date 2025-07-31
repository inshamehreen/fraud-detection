import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartDisplay() {
  const data = {
    labels: ['Normal', 'Fraudulent'],
    datasets: [
      {
        label: 'Transaction Count',
        data: [120, 30], // Replace with dynamic values later
        backgroundColor: ['#4caf50', '#f44336'],
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#f3f4f6', // Tailwind's gray-100 for text
          font: {
            family: 'Rubik',
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Transaction Distribution',
        color: '#facc15', // Tailwind's yellow-400
        font: {
          family: 'Alfa Slab One',
          size: 22,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#f3f4f6',
          font: {
            family: 'Rubik',
          },
        },
        grid: {
          color: '#374151', // Tailwind's gray-700
        },
      },
      y: {
        ticks: {
          color: '#f3f4f6',
          font: {
            family: 'Rubik',
          },
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md text-white max-w-2xl mx-auto my-8">
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartDisplay;
