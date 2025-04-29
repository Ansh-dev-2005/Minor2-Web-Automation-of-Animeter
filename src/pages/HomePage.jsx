import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="py-5 text-center bg-primary text-white">
        <Container>
          <h1 className="display-4 fw-bold">Animeter Wildlife Analysis</h1>
          <p className="lead mb-4">
            A comprehensive web portal for analyzing camera trap images of wildlife
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button variant="light" size="lg" as={Link} to="/register" className="px-4 gap-3">
              Get Started
            </Button>
            <Button variant="outline-light" size="lg" as={Link} to="/login" className="px-4">
              Login
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Key Features</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <i className="fas fa-ruler fa-3x text-primary mb-3"></i>
                  <Card.Title>Distance Calibration</Card.Title>
                  <Card.Text>
                    Accurately calibrate distances in your images using advanced algorithms.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <i className="fas fa-images fa-3x text-primary mb-3"></i>
                  <Card.Title>Sequence Analysis</Card.Title>
                  <Card.Text>
                    Group and analyze sequences of animal movements across multiple images.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
                  <Card.Title>Speed Calculation</Card.Title>
                  <Card.Text>
                    Calculate animal speed, distance traveled, and movement patterns.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="align-items-center">
            <Col md={6} className="mb-4">
              <img 
                src="/assets/images/workflow.png" 
                alt="Animeter Workflow" 
                className="img-fluid rounded shadow-sm"
              />
            </Col>
            <Col md={6}>
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>1</div>
                </div>
                <div>
                  <h4>Upload Images</h4>
                  <p>Import your camera trap images to the platform.</p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>2</div>
                </div>
                <div>
                  <h4>Calibrate</h4>
                  <p>Set up distance calibration for accurate measurements.</p>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>3</div>
                </div>
                <div>
                  <h4>Analyze</h4>
                  <p>Process images to extract distance, angle, and speed data.</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>4</div>
                </div>
                <div>
                  <h4>Export</h4>
                  <p>Download your results in CSV, JSON, or PDF formats.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 text-center">
        <Container>
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4">
            Join researchers worldwide who are using Animeter to analyze wildlife data.
          </p>
          <Button variant="primary" size="lg" as={Link} to="/register">
            Create Free Account
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;