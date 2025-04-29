import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProjectContext } from '../context/ProjectContext';

const DashboardPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { projects, loading, error, fetchProjects, createProject, deleteProject } = useContext(ProjectContext);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    habitatType: 'forest',
    startDate: '',
    endDate: ''
  });
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    console.log('Fetching projects for user:');
    fetchProjects();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      if (!formData.name) {
        setFormError('Project name is required');
        return;
      }
      
      await createProject(formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        location: '',
        habitatType: 'forest',
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project');
    }
  };
  
  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };
  
  const handleDeleteProject = async () => {
    try {
      if (projectToDelete) {
        await deleteProject(projectToDelete._id);
        setShowDeleteModal(false);
        setProjectToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <i className="fas fa-plus me-2"></i> New Project
        </Button>
      </div>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stats-card primary shadow-sm">
            <Card.Body>
              <h5 className="card-title">Projects</h5>
              <h2>{projects?.length || 0}</h2>
              <p className="text-muted">Total wildlife projects</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card success shadow-sm">
            <Card.Body>
              <h5 className="card-title">Species</h5>
              <h2>--</h2>
              <p className="text-muted">Unique species identified</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card warning shadow-sm">
            <Card.Body>
              <h5 className="card-title">Images</h5>
              <h2>--</h2>
              <p className="text-muted">Camera trap images</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stats-card danger shadow-sm">
            <Card.Body>
              <h5 className="card-title">Analysis</h5>
              <h2>--</h2>
              <p className="text-muted">Completed analyses</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h2 className="mb-3">My Projects</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : projects && projects.length > 0 ? (
        <Row>
          {projects.map((project) => (
            <Col key={project._id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{project.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {project.habitatType && project.habitatType.charAt(0).toUpperCase() + project.habitatType.slice(1)}
                  </Card.Subtitle>
                  <Card.Text>
                    {project.description || 'No description provided.'}
                  </Card.Text>
                  <div className="d-flex justify-content-between mt-3">
                    <small className="text-muted">
                      Images: {project.imageCount || 0}
                    </small>
                    <small className="text-muted">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-flex justify-content-between">
                    <Button 
                      variant="outline-primary" 
                      as={Link} 
                      to={`/projects/${project._id}`}
                    >
                      <i className="fas fa-eye me-1"></i> View
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => confirmDelete(project)}
                    >
                      <i className="fas fa-trash me-1"></i> Delete
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
            <h4>No Projects Found</h4>
            <p className="text-muted">
              Get started by creating your first wildlife research project.
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create New Project
            </Button>
          </Card.Body>
        </Card>
      )}
      
      {/* Create Project Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleCreateProject}>
            <Form.Group className="mb-3">
              <Form.Label>Project Name*</Form.Label>
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
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateProject}>
            Create Project
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the project "{projectToDelete?.name}"?</p>
          <p className="text-danger">This action cannot be undone. All project data, images, and analysis will be permanently deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProject}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DashboardPage;