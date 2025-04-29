import React from 'react';
import { useParams } from 'react-router-dom';

const AnalysisPage = () => {
  const { id } = useParams();
  
  return (
    <div className="analysis-page">
      <h1>Image Analysis</h1>
      <p>Project ID: {id}</p>
      <div className="analysis-container">
        <p>Run analysis on your calibrated images here. Select algorithms and parameters to process your image sequences.</p>
      </div>
    </div>
  );
};

export default AnalysisPage;