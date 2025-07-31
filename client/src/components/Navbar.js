import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary text-white px-6 py-4 shadow-md font-rubik">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-slab tracking-wide">
          Fraud Detector
        </div>
        <div className="space-x-6">
          <Link to="/" className="hover:text-highlight">Home</Link>
          <Link to="/upload" className="hover:text-highlight">Upload</Link>
          <Link to="/visualize" className="hover:text-highlight">Visualize</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
