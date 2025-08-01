import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Visualize from './pages/Visualize';
import CsvUpload from './CsvUpload';
import MLAlgorithms from './pages/MLAlgorithms';



function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<CsvUpload />} />
        <Route path="/visualize" element={<Visualize />} />
        <Route path="/ml-algorithms" element={<MLAlgorithms />} />
      </Routes>
    </div>
  );
}


// function App() {
//   return (
//     <div className="min-h-screen bg-primary text-white font-rubik flex items-center justify-center">
//       <h1 className="text-4xl font-slab text-highlight animate-bounce">Tailwind is working! 🎉</h1>
//     </div>
//   );
// }


export default App;
