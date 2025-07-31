import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#282c34', color: 'white' }}>
      <Link to="/" style={{ marginRight: '20px', color: 'white' }}>Home</Link>
      <Link to="/predict" style={{ marginRight: '20px', color: 'white' }}>Predict</Link>
      <Link to="/visualize" style={{ color: 'white' }}>Visualize</Link>
    </nav>
  );
}

export default Navbar;
