import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProjectPage = () => {
  const { id } = useParams();
  const { getProject, currentProject, updateProject, loading, error, csvExport } = useContext(ProjectContext);

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    habitatType: 'forest',
    startDate: '',
    endDate: ''
  });

  // Load project data
  useEffect(() => {
    getProject(id);
  }, [id]);

  // Update form data when project data changes
  useEffect(() => {
    if (currentProject) {
      setFormData({
        name: currentProject.name || '',
        description: currentProject.description || '',
        location: currentProject.location || '',
        habitatType: currentProject.habitatType || 'forest',
        startDate: currentProject.startDate ? new Date(currentProject.startDate).toISOString().split('T')[0] : '',
        endDate: currentProject.endDate ? new Date(currentProject.endDate).toISOString().split('T')[0] : ''
      });
    }
  }, [currentProject]);

  // Fetch project images
  const fetchProjectImages = async () => {
    try {
      setImagesLoading(true);
      setImagesError('');

      const response = await axios.get(`${API_URL}/api/images/project/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setImages(response.data.images || []);

    } catch (err) {
      console.error('Error fetching images:', err);
      setImagesError(err.response?.data?.message || 'Failed to fetch project images');
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectImages();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditProject = async (e) => {
    e.preventDefault();

    try {
      await updateProject(id, formData);
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };


  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();

      // Append each file to the form data
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // Upload with progress tracking
      await axios.post(`${API_URL}/api/images/upload/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      // Refresh images list
      fetchProjectImages();

      // Reset state
      setSelectedFiles([]);
      setUploadProgress(0);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };
  const ExportCSV = async () => {
    // call csvExport function from ProjectContext
    try {
     csvExport(id)
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
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
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Project not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>{currentProject.name}</h1>
          <p className="text-muted mb-0">
            {currentProject.habitatType && (
              <Badge bg="info" className="me-2">
                {currentProject.habitatType.charAt(0).toUpperCase() + currentProject.habitatType.slice(1)}
              </Badge>
            )}
            {currentProject.location && (
              <span className="me-2"><i className="fas fa-map-marker-alt me-1"></i>{currentProject.location}</span>
            )}
            {currentProject.startDate && (
              <span><i className="fas fa-calendar-alt me-1"></i>
                {new Date(currentProject.startDate).toLocaleDateString()}
                {currentProject.endDate && ` - ${new Date(currentProject.endDate).toLocaleDateString()}`}
              </span>
            )}
          </p>
        </div>
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={() => setShowEditModal(true)}>
            <i className="fas fa-edit me-1"></i> Edit
          </Button>
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
            <i className="fas fa-upload me-1"></i> Upload Images
          </Button>
        </div>
      </div>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5>Description</h5>
          <p>{currentProject.description || 'No description provided.'}</p>

          <Row className="mt-4">
            <Col md={3}>
              <div className="mb-3">
                <small className="text-muted d-block">Created by</small>
                <span>{currentProject.user?.name || 'Unknown user'}</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <small className="text-muted d-block">Images</small>
                <span>{currentProject.imageCount || 0}</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <small className="text-muted d-block">Calibrated</small>
                <span>{currentProject.calibrated ? 'Yes' : 'No'}</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-3">
                <small className="text-muted d-block">Created on</small>
                <span>{new Date(currentProject.createdAt).toLocaleDateString()}</span>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="images" className="mb-3">
        <Tab eventKey="images" title="Images">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Project Images</h5>
                <Button variant="primary" size="sm" onClick={() => setShowUploadModal(true)}>
                  <i className="fas fa-upload me-1"></i> Upload
                </Button>
              </div>

              {imagesError && (
                <Alert variant="danger">
                  {imagesError}
                </Alert>
              )}

              {imagesLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : images.length > 0 ? (
                <div className="image-gallery">
                  {images.map((image) => (
                    <div key={image._id} className="gallery-item">
                      <img
                        src={`${API_URL}/api/images/${image._id}/thumbnail?token=${localStorage.getItem('token')}`}
                        alt={image.originalFilename || 'Camera trap image'}
                      />
                      <div className="overlay">
                        <small title={image.originalFilename}>
                          {image.originalFilename?.length > 20
                            ? image.originalFilename.substring(0, 17) + '...'
                            : image.originalFilename}
                        </small>
                        {image.speciesName && (
                          <div><Badge bg="info">{image.speciesName}</Badge></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-images fa-3x text-muted mb-3"></i>
                  <h5>No Images Yet</h5>
                  <p className="text-muted mb-4">Upload camera trap images to begin analysis</p>
                  <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                    Upload Images
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="analysis" title="Analysis">
          <Card className="text-center py-5">
            <Card.Body>
              <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
              <h4>Analysis Tools</h4>
              <p className="text-muted mb-4">Access tools to analyze your camera trap images</p>

              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button as={Link} to={`/projects/${id}/calibration`} variant="outline-primary">
                  <i className="fas fa-ruler me-2"></i>
                  Calibration Tool
                </Button>
                <Button as={Link} to={`/projects/${id}/sequences`} variant="outline-primary">
                  <i className="fas fa-images me-2"></i>
                  Create Sequences
                </Button>
                <Button as={Link} to={`/projects/${id}/analysis`} variant="outline-primary">
                  <i className="fas fa-chart-line me-2"></i>
                  Analysis Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="results" title="Results">
          <Card className="text-center py-5">
            <Card.Body>
              <i className="fas fa-file-export fa-3x text-muted mb-3"></i>
              <h4>Export Results</h4>
              <p className="text-muted mb-4">Export your analysis results in various formats</p>

              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Button as={Link} to={`/projects/${id}/results`} variant="outline-primary">
                  <i className="fas fa-table me-2"></i>
                  View Results
                </Button>
                <Button onClick={
                  ExportCSV
                } variant="outline-primary">
                  <i className="fas fa-file-csv me-2"></i>
                  CSV Export
                </Button>
                <Button variant="outline-primary">
                  <i className="fas fa-file-code me-2"></i>
                  JSON Export
                </Button>
                <Button variant="outline-primary">
                  <i className="fas fa-file-pdf me-2"></i>
                  PDF Report
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditProject}>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Habitat Type</Form.Label>
                  <Form.Select
                    name="habitatType"
                    value={formData.habitatType}
                    onChange={handleInputChange}
                  >
                    <option value="forest">Forest</option>
                    <option value="grassland">Grassland</option>
                    <option value="wetland">Wetland</option>
                    <option value="desert">Desert</option>
                    <option value="mountain">Mountain</option>
                    <option value="marine">Marine</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditProject}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upload Images Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group className="mb-3">
              <Form.Label>Select Camera Trap Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Form.Text className="text-muted">
                You can select multiple images (JPG, PNG, etc.)
              </Form.Text>
            </Form.Group>

            {selectedFiles.length > 0 && (
              <div className="mb-3">
                <p className="mb-1">Selected {selectedFiles.length} files:</p>
                <ul className="list-group small">
                  {selectedFiles.slice(0, 3).map((file, index) => (
                    <li key={index} className="list-group-item py-1">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                  {selectedFiles.length > 3 && (
                    <li className="list-group-item py-1 text-muted">
                      And {selectedFiles.length - 3} more files...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {isUploading && (
              <div className="mb-3">
                <Form.Label>Upload Progress</Form.Label>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectPage;