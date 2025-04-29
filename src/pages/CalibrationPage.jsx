import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import CalibrationTool from '../components/Analysis/CalibrationTool';
import axios from 'axios';

const CalibrationPage = () => {
  const { id } = useParams();
  const { fetchProjectById, currentProject, loading, error } = useContext(ProjectContext);
  const navigate = useNavigate();
  
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  
  // Load project data
  useEffect(() => {
    fetchProjectById(id);
  }, [fetchProjectById, id]);
  
  // Load project images for calibration
  useEffect(() => {
    const fetchProjectImages = async () => {
      try {
        setImagesLoading(true);
        
        // Get all project images
        const response = await axios.get(`/api/images/project/${id}`);
        setImages(response.data.images || []);
        
        if (response.data.images && response.data.images.length > 0) {
          // Check if project already has calibration
          try {
            const calibrationRes = await axios.get(`/api/projects/${id}/calibration`);
            if (calibrationRes.data && calibrationRes.data._id) {
              setCalibrationComplete(true);
              
              // Select the calibration image by default
              setSelectedImageId(calibrationRes.data.imageId);
            } else {
              // Select first image by default
              setSelectedImageId(response.data.images[0]._id);
            }
          } catch (err) {
            // No calibration found, select first image
            setSelectedImageId(response.data.images[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching images for calibration:', err);
      } finally {
        setImagesLoading(false);
      }
    };
    
    if (id) {
      fetchProjectImages();
    }
  }, [id]);
  
  const handleImageSelect = (e) => {
    setSelectedImageId(e.target.value);
  };
  
  const handleCalibrationSaved = (calibrationData) => {
    setCalibrationComplete(true);
    
    // Update project status
    fetchProjectById(id);
  };
  
  const handleContinue = () => {
    // Navigate to analysis page or sequence page
    navigate(`/projects/${id}/sequences`);
  };
  
  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }
  
  if (!currentProject) {
    return (
      <Container className="py-4">
        <Alert variant="warning">Project not found.</Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Distance Calibration</h1>
          <p className="text-muted mb-0">
            Project: {currentProject.name}
          </p>
        </div>
        <Button variant="outline-primary" onClick={() => navigate(`/projects/${id}`)}>
          Back to Project
        </Button>
      </div>
      
      <Card className="mb-4 bg-light">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-2">Why Calibration Matters</h5>
              <p className="mb-0">
                Distance calibration is essential for accurate analysis of animal movement and speed. 
                By establishing a known reference measurement, all distance and speed calculations 
                will be precise, enabling reliable research conclusions.
              </p>
            </Col>
            <Col md={4} className="text-end">
              <div className="calibration-status">
                <span className="me-2">Status:</span>
                {calibrationComplete ? (
                  <span className="badge bg-success">Calibrated</span>
                ) : (
                  <span className="badge bg-warning text-dark">Not Calibrated</span>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {images.length > 0 ? (
        <>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Select Reference Image</h5>
              <p className="text-muted">Choose an image containing a clear reference object of known size for calibration.</p>
              
              <Form.Group className="mb-4">
                <Form.Select value={selectedImageId || ''} onChange={handleImageSelect} disabled={imagesLoading}>
                  {images.map((image) => (
                    <option key={image._id} value={image._id}>
                      {image.originalFilename || image._id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <div className="d-flex justify-content-center mb-3">
                {selectedImageId && (
                  <img
                    src={`/api/images/${selectedImageId}/thumbnail`}
                    alt="Selected reference"
                    className="img-fluid"
                    style={{ maxHeight: '150px' }}
                  />
                )}
              </div>
            </Card.Body>
          </Card>
          
          {selectedImageId && (
            <CalibrationTool 
              projectId={id} 
              imageId={selectedImageId}
              onCalibrationSaved={handleCalibrationSaved}
            />
          )}
          
          {calibrationComplete && (
            <div className="text-center mt-4">
              <Button variant="success" size="lg" onClick={handleContinue}>
                Continue to Next Step <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="text-center p-5">
          <Card.Body>
            <i className="fas fa-images fa-3x text-muted mb-3"></i>
            <h4>No Images Available</h4>
            <p className="text-muted mb-4">
              Upload camera trap images to your project before calibration.
            </p>
            <Button variant="primary" onClick={() => navigate(`/projects/${id}`)}>
              Upload Images
            </Button>
          </Card.Body>
        </Card>
      )}
      
      <Card className="mt-4">
        <Card.Body>
          <h5>Calibration Tips</h5>
          <ul>
            <li>Choose an image with a clear reference object of known size</li>
            <li>Use a ruler, measuring tape, or other object with definite measurements visible in the frame</li>
            <li>Mark points as precisely as possible for accurate calibration</li>
            <li>Once calibrated, all distance measurements in the project will use this scale</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CalibrationPage;