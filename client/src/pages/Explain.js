import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Explain = () => {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/explain-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRows(response.data.rows || []);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-black font-rubik px-4 py-10">
      <motion.div
        className="bg-white rounded-lg shadow-xl p-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-slab text-secondary mb-6">
          📊 SHAP Explanation Dashboard
        </h1>

        <input type="file" onChange={handleFileChange} className="mb-4" />
        <br />
        <button
          onClick={handleUpload}
          className="bg-primary text-white px-5 py-2 rounded-md hover:bg-secondary transition duration-300"
        >
          Upload & Explain
        </button>

        {rows.length > 0 && (
          <div className="mt-10">
            {rows.map((row, idx) => {
              const labels = Object.keys(row.contributions);
              const values = Object.values(row.contributions);

              const chartData = {
                labels,
                datasets: [
                  {
                    label: "SHAP Contribution",
                    data: values,
                    backgroundColor: values.map((v) =>
                      v >= 0 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"
                    ),
                  },
                ],
              };

              const options = {
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: `Row ${row.row} - ${row.prediction}` },
                },
              };

              return (
                <div key={idx} className="mt-8 p-4 border rounded bg-gray-50 shadow-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Row {row.row} → Prediction:{" "}
                    <span className={row.prediction === "Fraud" ? "text-red-600" : "text-green-600"}>
                      {row.prediction}
                    </span>
                  </h3>
                  <Bar data={chartData} options={options} />
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Explain;
