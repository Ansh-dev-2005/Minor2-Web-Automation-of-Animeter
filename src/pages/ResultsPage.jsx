import React from 'react';
import { useParams } from 'react-router-dom';

const ResultsPage = () => {
  const { id } = useParams();
  
  return (
    <div className="results-page">
      <h1>Analysis Results</h1>
      <p>Project ID: {id}</p>
      <div className="results-container">
        <p>View and download your analysis results here. This page displays visualizations, statistics, and exportable data from your processed image sequences.</p>
      </div>
    </div>
  );
};

export default ResultsPage;