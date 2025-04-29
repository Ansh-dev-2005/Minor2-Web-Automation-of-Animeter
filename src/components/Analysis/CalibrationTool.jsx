import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const CalibrationTool = ({ projectId, imageId, onCalibrationSaved }) => {
  const [image, setImage] = useState(null);
  const [calibration, setCalibration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState('cm');
  const [message, setMessage] = useState('');
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  
  // Fetch the image to calibrate
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/images/${imageId}`);
        setImage(response.data);
        
        // Check if this image already has calibration
        const calibrationResponse = await axios.get(`/api/projects/${projectId}/calibration`);
        if (calibrationResponse.data) {
          setCalibration(calibrationResponse.data);
          
          if (calibrationResponse.data.points && calibrationResponse.data.points.length > 0) {
            setPoints(calibrationResponse.data.points);
          }
          
          if (calibrationResponse.data.distance) {
            setDistance(calibrationResponse.data.distance.toString());
          }
          
          if (calibrationResponse.data.unit) {
            setUnit(calibrationResponse.data.unit);
          }
        }
      } catch (err) {
        console.error('Error fetching image for calibration:', err);
        setError(err.response?.data?.message || 'Failed to load image for calibration');
      } finally {
        setLoading(false);
      }
    };
    
    if (imageId) {
      fetchImage();
    }
  }, [projectId, imageId]);
  
  // Draw canvas with image and points when they change
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !imageRef.current.complete) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Draw the points
    points.forEach((point, index) => {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(
        (point.x / img.naturalWidth) * canvas.width, 
        (point.y / img.naturalHeight) * canvas.height, 
        5, 0, 2 * Math.PI
      );
      ctx.fill();
      
      // Draw point number
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        (index + 1).toString(), 
        (point.x / img.naturalWidth) * canvas.width, 
        (point.y / img.naturalHeight) * canvas.height
      );
    });
    
    // Draw line between points if there are 2 points
    if (points.length === 2) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(
        (points[0].x / img.naturalWidth) * canvas.width,
        (points[0].y / img.naturalHeight) * canvas.height
      );
      ctx.lineTo(
        (points[1].x / img.naturalWidth) * canvas.width,
        (points[1].y / img.naturalHeight) * canvas.height
      );
      ctx.stroke();
    }
  }, [points, canvasRef.current, imageRef.current?.complete]);
  
  // Handle image load to make sure canvas is drawn after image loads
  const handleImageLoad = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const img = imageRef.current;
      
      // Set canvas dimensions to match image display size
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      
      // Draw initial image and points
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Draw saved points if any
      points.forEach((point, index) => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
          (point.x / img.naturalWidth) * canvas.width, 
          (point.y / img.naturalHeight) * canvas.height, 
          5, 0, 2 * Math.PI
        );
        ctx.fill();
        
        // Draw point number
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          (index + 1).toString(), 
          (point.x / img.naturalWidth) * canvas.width, 
          (point.y / img.naturalHeight) * canvas.height
        );
      });
      
      // Draw line between points if there are 2 points
      if (points.length === 2) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          (points[0].x / img.naturalWidth) * canvas.width,
          (points[0].y / img.naturalHeight) * canvas.height
        );
        ctx.lineTo(
          (points[1].x / img.naturalWidth) * canvas.width,
          (points[1].y / img.naturalHeight) * canvas.height
        );
        ctx.stroke();
      }
    }
  };
  
  // Handle canvas clicks to add/remove points
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const img = imageRef.current;
    
    // Convert canvas coordinates to original image coordinates
    const originalX = (x / canvas.width) * img.naturalWidth;
    const originalY = (y / canvas.height) * img.naturalHeight;
    
    // If we already have 2 points, reset
    if (points.length >= 2) {
      setPoints([{ x: originalX, y: originalY }]);
      return;
    }
    
    // Add new point
    setPoints([...points, { x: originalX, y: originalY }]);
  };
  
  // Calculate real distance between two points
  const calculateDistance = () => {
    if (points.length !== 2 || !distance) {
      setMessage('Please mark two points and enter the real-world distance');
      return;
    }
    
    if (parseFloat(distance) <= 0) {
      setMessage('Please enter a valid positive distance');
      return;
    }
    
    // Calculate pixel distance
    const pixelDistance = Math.sqrt(
      Math.pow(points[1].x - points[0].x, 2) + 
      Math.pow(points[1].y - points[0].y, 2)
    );
    
    // Calculate real distance per pixel
    const realDistancePerPixel = parseFloat(distance) / pixelDistance;
    
    return {
      pixelDistance,
      realDistancePerPixel
    };
  };
  
  // Save calibration
  const saveCalibration = async () => {
    try {
      setError(null);
      setMessage('');
      
      const distanceInfo = calculateDistance();
      if (!distanceInfo) return;
      
      const { pixelDistance, realDistancePerPixel } = distanceInfo;
      
      const calibrationData = {
        projectId,
        imageId,
        points,
        pixelDistance,
        distance: parseFloat(distance),
        unit,
        realDistancePerPixel
      };
      
      const response = await axios.post(`/api/projects/${projectId}/calibration`, calibrationData);
      
      setCalibration(response.data);
      setMessage('Calibration saved successfully!');
      
      if (onCalibrationSaved) {
        onCalibrationSaved(response.data);
      }
    } catch (err) {
      console.error('Calibration save error:', err);
      setError(err.response?.data?.message || 'Failed to save calibration');
    }
  };
  
  // Reset calibration
  const resetCalibration = () => {
    setPoints([]);
    setDistance('');
    setMessage('');
  };
  
  if (loading) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading calibration tool...</p>
        </Card.Body>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }
  
  if (!image) {
    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Alert variant="warning">No image selected for calibration.</Alert>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="mb-3">Distance Calibration Tool</h5>
        
        <p className="text-muted mb-4">
          To calibrate distances, mark two points on the image that represent a known real-world distance (e.g., a reference object of known size).
        </p>
        
        {message && <Alert variant={message.includes('success') ? 'success' : 'info'} onClose={() => setMessage('')} dismissible>{message}</Alert>}
        
        <div className="position-relative mb-4">
          <img
            ref={imageRef}
            src={`/api/images/${imageId}`}
            alt="Calibration reference"
            className="img-fluid w-100"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="position-absolute top-0 start-0 w-100 h-100 calibration-canvas"
          />
        </div>
        
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Reference Distance</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter known distance"
                />
                <Form.Select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '80px' }}
                  className="ms-2"
                >
                  <option value="mm">mm</option>
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="inch">inch</option>
                  <option value="ft">ft</option>
                </Form.Select>
              </div>
              <Form.Text className="text-muted">
                Enter the real-world distance between the two marked points
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end">
            <div className="d-flex w-100 gap-2">
              <Button variant="primary" onClick={saveCalibration} disabled={points.length !== 2 || !distance} className="flex-grow-1">
                Save Calibration
              </Button>
              <Button variant="outline-secondary" onClick={resetCalibration}>
                Reset
              </Button>
            </div>
          </Col>
        </Row>
        
        {calibration && calibration.realDistancePerPixel && (
          <Alert variant="info">
            <h6>Calibration Information</h6>
            <p className="mb-1">Scale: 1 pixel = {calibration.realDistancePerPixel.toFixed(4)} {calibration.unit}</p>
            <p className="mb-0">Reference: {calibration.distance} {calibration.unit} ({calibration.pixelDistance.toFixed(1)} pixels)</p>
          </Alert>
        )}
        
        <div className="mt-3">
          <p><strong>Instructions:</strong></p>
          <ol className="ps-3">
            <li className="mb-2">Click on two distinct points on the image that represent a known distance</li>
            <li className="mb-2">Enter the real-world distance between these points (e.g., 10 cm)</li>
            <li className="mb-2">Save the calibration to establish the measurement scale for this project</li>
          </ol>
          <p className="text-muted small">
            This calibration will be used for all measurements in this project. For best results, use a clearly visible reference object of known size.
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CalibrationTool;