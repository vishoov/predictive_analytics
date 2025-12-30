import React from 'react'
import { useAuth } from '../context/authContext.jsx';
import { useNavigate, Navigate } from 'react-router-dom';

const UserDashboard = () => {
  // Fixed: Destructure the user object from useAuth hook
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated - using Navigate component
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome to the User Dashboard of the diagnostics review portal.</p>
      <p>Hello, {user.name || user.email}!</p>

      {/* Use logout from context instead of manual cleanup */}
      <button 
        onClick={() => {
          logout();
          navigate('/login');
        }} 
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}

export default UserDashboard
