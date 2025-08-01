import React, { useState } from 'react';
import axios from 'axios';

const Explain = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [shapHtmls, setShapHtmls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/explain-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { shap_htmls } = response.data;
      setShapHtmls(shap_htmls);
    } catch (error) {
      console.error('Error uploading file and getting explanation:', error);
      alert('Failed to generate SHAP explanations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#002b5b', color: 'white', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '1rem' }}>Fraud Explanation (SHAP)</h2>

      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem', backgroundColor: '#fcd34d', border: 'none', fontWeight: 'bold' }}
      >
        Upload & Explain
      </button>

      {loading && <p style={{ marginTop: '1rem' }}>Generating explanation...</p>}

      {shapHtmls.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>SHAP Visual Explanations</h3>
          {shapHtmls.map((url, idx) => (
            <div key={idx} style={{ margin: '2rem 0' }}>
              <h4>Transaction {idx + 1}</h4>
              <iframe
                src={url}
                title={`SHAP Explanation ${idx + 1}`}
                width="100%"
                height="600px"
                style={{ border: '1px solid #ccc', borderRadius: '8px' }}
              ></iframe>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explain;
