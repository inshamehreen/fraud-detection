import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary px-6 py-4 shadow-md font-rubik">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-slab tracking-wide text-highlight">
          Fraud Detector
        </div>
        <div className="space-x-6">
          <Link to="/" className="text-highlight hover:text-white transition">Home</Link>
          <Link to="/upload" className="text-highlight hover:text-white transition">Upload</Link>
          <Link to="/visualize" className="text-highlight hover:text-white transition">Visualize</Link>
          <Link to="/ml-algorithms" className="text-highlight hover:text-white transition">ML Algorithms</Link>
          <Link to="/explain" className="text-highlight hover:text-white transition">Explain</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
