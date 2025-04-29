import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

// Layout components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';

// Auth pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Main pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import CalibrationPage from './pages/CalibrationPage';
import SequencePage from './pages/SequencePage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route component
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
        <div className="app-container">
          <Header toggleSidebar={toggleSidebar} />
          <div className="main-content">
            {localStorage.getItem('token') && (
              <Sidebar isOpen={isSidebarOpen} />
            )}
            <div className={`content ${isSidebarOpen && localStorage.getItem('token') ? 'with-sidebar' : ''}`}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
                <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectPage />} />} />
                <Route path="/projects/:id/calibration" element={<ProtectedRoute element={<CalibrationPage />} />} />
                <Route path="/projects/:id/sequences" element={<ProtectedRoute element={<SequencePage />} />} />
                <Route path="/projects/:id/analysis" element={<ProtectedRoute element={<AnalysisPage />} />} />
                <Route path="/projects/:id/results" element={<ProtectedRoute element={<ResultsPage />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
                
                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </ProjectProvider>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;