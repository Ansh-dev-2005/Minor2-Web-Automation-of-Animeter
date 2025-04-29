import React from 'react';
import { useParams } from 'react-router-dom';

const SequencePage = () => {
  const { id } = useParams();
  
  return (
    <div className="sequence-page">
      <h1>Image Sequences</h1>
      <p>Project ID: {id}</p>
      <div className="sequence-container">
        <p>Manage your image sequences here. This page will let you upload, organize, and prepare images for analysis.</p>
      </div>
    </div>
  );
};

export default SequencePage;