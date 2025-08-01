import React from 'react';
import ModelChart from './ModelChart';

function AlgorithmCard({ name, pros, cons }) {
  return (
    <div className="bg-white text-black rounded-lg shadow-md mb-8 p-6">
      <h2 className="text-2xl font-bold mb-4 font-slab text-[#58A0C8]">{name}</h2>

      {/* Chart instead of image */}
      <ModelChart algo={name} />

      {/* Pros */}
      <h3 className="text-xl font-semibold mt-4 mb-2 text-green-700">Pros</h3>
      <ul className="list-disc list-inside mb-4">
        {pros.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>

      {/* Cons */}
      <h3 className="text-xl font-semibold mb-2 text-red-700">Cons</h3>
      <ul className="list-disc list-inside">
        {cons.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

export default AlgorithmCard;
