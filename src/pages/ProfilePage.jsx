import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    organization: ''
  });
  
  // In a real implementation, you would fetch user data here
  useEffect(() => {
    // Placeholder for API call
    // Example: fetchUserProfile().then(data => setUser(data));
    
    // For now, just set sample data
    setUser({
      name: 'Demo User',
      email: 'user@example.com',
      organization: 'Research Institute'
    });
  }, []);

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-container">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-field">
            <label>Name:</label>
            <div>{user.name}</div>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <div>{user.email}</div>
          </div>
          <div className="profile-field">
            <label>Organization:</label>
            <div>{user.organization}</div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn primary">Edit Profile</button>
          <button className="btn secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;