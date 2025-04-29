import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Create a base API URL using environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);
  
  // Fetch all projects for the user
  const fetchProjects = async () => {
    console.log('Fetching projects...');
    console.log('isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/projects`);
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load projects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [isAuthenticated]);
  
  // Get project by ID
  const getProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/projects/${projectId}`);
      setCurrentProject(response.data);
      return response.data;
    } catch (err) {
      console.error(`Error fetching project ${projectId}:`, err);
      setError('Failed to fetch project details. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Create new project
  const createProject = async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/api/projects`, projectData);
      
      // Add the new project to the projects list
      setProjects([...projects, response.data]);
      
      return response.data;
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update project
  const updateProject = async (projectId, projectData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/api/projects/${projectId}`, projectData);
      
      // Update the projects list with the updated project
      setProjects(projects.map(project => 
        project._id === projectId ? response.data : project
      ));
      
      // If this is the current project, update it
      if (currentProject && currentProject._id === projectId) {
        setCurrentProject(response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error(`Error updating project ${projectId}:`, err);
      setError(err.response?.data?.message || 'Failed to update project. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete project
  const deleteProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`${API_URL}/api/projects/${projectId}`);
      
      // Remove the project from the projects list
      setProjects(projects.filter(project => project._id !== projectId));
      
      // If this is the current project, clear it
      if (currentProject && currentProject._id === projectId) {
        setCurrentProject(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error deleting project ${projectId}:`, err);
      setError(err.response?.data?.message || 'Failed to delete project. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Upload images to a project
  const uploadImages = async (projectId, formData, onProgress) => {
    try {
      setError(null);
      
      const response = await axios.post(
        `${API_URL}/api/projects/${projectId}/images/upload`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (onProgress) onProgress(percentCompleted);
          }
        }
      );
      
      return response.data;
    } catch (err) {
      console.error(`Error uploading images to project ${projectId}:`, err);
      setError(err.response?.data?.message || 'Failed to upload images. Please try again.');
      throw err;
    }
  };
  
  // Get project images
  const getProjectImages = async (projectId, page = 1, limit = 20, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await axios.get(`${API_URL}/api/projects/${projectId}/images?${queryParams}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching images for project ${projectId}:`, err);
      setError('Failed to fetch project images. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new project sequence
  const createSequence = async (projectId, sequenceData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_URL}/api/projects/${projectId}/sequences`, 
        sequenceData
      );
      
      return response.data;
    } catch (err) {
      console.error(`Error creating sequence in project ${projectId}:`, err);
      setError(err.response?.data?.message || 'Failed to create sequence. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // create exports

  const csvExport = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${API_URL}/api/export/${projectId}/csv`, 
        { responseType: 'blob' }
      );
      
      // Create a link element to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project_${projectId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Error exporting project ${projectId} to CSV:`, err);
      setError(err.response?.data?.message || 'Failed to export project. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        uploadImages,
        getProjectImages,
        createSequence,
        csvExport
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;