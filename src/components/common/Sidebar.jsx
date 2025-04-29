import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ProjectContext } from '../../context/ProjectContext';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { currentProject } = useContext(ProjectContext);
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-sticky">
        <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>General</span>
        </h5>
        <Nav className="flex-column">
          <Nav.Link 
            as={Link} 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'active' : ''}
          >
            <i className="fas fa-tachometer-alt me-2"></i>
            Dashboard
          </Nav.Link>
        </Nav>
        
        {currentProject && (
          <>
            <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Current Project</span>
            </h5>
            <Nav className="flex-column">
              <Nav.Link 
                as={Link} 
                to={`/projects/${currentProject._id}`} 
                className={isActive(`/projects/${currentProject._id}`) && !isActive(`/projects/${currentProject._id}/`)}
              >
                <i className="fas fa-folder-open me-2"></i>
                Overview
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to={`/projects/${currentProject._id}/calibration`}
                className={isActive(`/projects/${currentProject._id}/calibration`) ? 'active' : ''}
              >
                <i className="fas fa-ruler me-2"></i>
                Calibration
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to={`/projects/${currentProject._id}/sequences`}
                className={isActive(`/projects/${currentProject._id}/sequences`) ? 'active' : ''}
              >
                <i className="fas fa-images me-2"></i>
                Sequences
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to={`/projects/${currentProject._id}/analysis`}
                className={isActive(`/projects/${currentProject._id}/analysis`) ? 'active' : ''}
              >
                <i className="fas fa-chart-line me-2"></i>
                Analysis
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to={`/projects/${currentProject._id}/results`}
                className={isActive(`/projects/${currentProject._id}/results`) ? 'active' : ''}
              >
                <i className="fas fa-file-export me-2"></i>
                Results & Export
              </Nav.Link>
            </Nav>
          </>
        )}
        
        <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>User</span>
        </h5>
        <Nav className="flex-column">
          <Nav.Link 
            as={Link} 
            to="/profile" 
            className={isActive('/profile') ? 'active' : ''}
          >
            <i className="fas fa-user-circle me-2"></i>
            Profile
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;