import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartDisplay({ chartType, chartData }) {
  const defaultData = {
    labels: ['Normal', 'Fraudulent'],
    datasets: [
      {
        label: 'Transaction Count',
        data: [120, 30],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: '#34699A',
        tension: 0.3,
        pointBackgroundColor: '#113F67',
      },
    ],
  };

  const dataToRender = chartData || defaultData;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Fraud Detection - ${chartType === 'bar' ? 'Bar' : 'Line'} Chart`,
        color: '#113F67',
        font: {
          family: 'Alfa Slab One',
          size: 20,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#113F67',
          font: {
            family: 'Rubik',
            weight: 'bold',
          },
        },
      },
      x: {
        ticks: {
          color: '#113F67',
          font: {
            family: 'Rubik',
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-[#FDF5AA] shadow-md rounded-md">
      {chartType === 'bar' ? (
        <Bar data={dataToRender} options={options} />
      ) : (
        <Line data={dataToRender} options={options} />
      )}
    </div>
  );
}

export default ChartDisplay;
