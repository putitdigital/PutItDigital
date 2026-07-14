import React from 'react';
import './UserProfile.css';

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Add more user details as needed */}
    </div>
  );
}

export default UserProfile;