import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Upload, BrainCircuit, BarChartHorizontal } from 'lucide-react'; // Added new icon

function Home() {
  return (
    <div className="bg-primary min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl text-white"
      >
        <h1 className="text-5xl font-slab text-[#FDF5A9] mb-4">
          Welcome to Your ML Dashboard
        </h1>
        <p className="text-xl text-[#58A0C8] font-rubik mb-8">
          Visualize, Predict, and Explore ML Models with Ease.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Link
            to="/upload"
            className="bg-[#FDF5A9] text-black px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            <Upload className="inline-block w-5 h-5 mr-2" />
            Upload CSV
          </Link>

          <Link
            to="/visualize"
            className="bg-[#58A0C8] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            <BarChart3 className="inline-block w-5 h-5 mr-2" />
            Visualize Data
          </Link>

          <Link
            to="/ml-algorithms"
            className="bg-[#34699A] text-white px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            <BrainCircuit className="inline-block w-5 h-5 mr-2" />
            Explore Algorithms
          </Link>

          <Link
            to="/explain"
            className="bg-[#FDF5A9] text-black px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            <BarChartHorizontal className="inline-block w-5 h-5 mr-2" />
            Explain Predictions
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
