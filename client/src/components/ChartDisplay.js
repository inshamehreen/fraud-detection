import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function ChartDisplay() {
  const data = {
    labels: ['Normal', 'Fraudulent'],
    datasets: [
      {
        label: 'Transaction Count',
        data: [120, 30], // Example data, replace dynamically
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return <Bar data={data} />;
}

export default ChartDisplay;
