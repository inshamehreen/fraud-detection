import React from 'react';

function Results({ data }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Prediction Results</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Results;
