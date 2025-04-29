import React, { useState, useContext } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there is a redirect path in the location state
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Call login from AuthContext
      await login(formData.email, formData.password);
      
      // Redirect to dashboard or original intended page
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <Card className="shadow border-0">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 className="mb-3">Welcome Back</h2>
            <p className="text-muted">Sign in to access your Animeter projects</p>
          </div>
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoFocus
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="d-flex justify-content-between align-items-center">
                <span>Password</span>
                <Link to="/forgot-password" className="small text-decoration-none">
                  Forgot password?
                </Link>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                id="rememberMe"
                label="Remember me"
              />
            </Form.Group>
            
            <div className="d-grid mb-4">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="py-2"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="mb-0">
                Don't have an account? <Link to="/register" className="text-decoration-none">Sign up</Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
      
      <div className="mt-4 text-center">
        <p className="text-muted small">
          &copy; {new Date().getFullYear()} Animeter Wildlife Analytics
        </p>
      </div>
    </div>
  );
};

export default Login;