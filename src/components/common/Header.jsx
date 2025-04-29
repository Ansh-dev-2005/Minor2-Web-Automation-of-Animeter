import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate  } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="sticky-top">
      <Container fluid>
        {currentUser && (
          <Button 
            variant="outline-light" 
            className="me-2 d-lg-none" 
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </Button>
        )}
        
        <Navbar.Brand as={Link} to={currentUser ? '/dashboard' : '/'}>
          <img
            src="/assets/images/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Animeter Logo"
          />
          Animeter
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Button 
                  variant="outline-light" 
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
                <Navbar.Text className="ms-3">
                  Signed in as: <span className="fw-bold">{currentUser.name}</span>
                </Navbar.Text>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;