import React from 'react'
import { useAuth } from '../context/authContext.jsx';
import { Navigate } from 'react-router-dom';
const RoleBasedRoutes = ({children, requiredRole}) => {
    const {user, isLoading} = useAuth();

    if(isLoading){
        return <div>Loading...</div>
    }

    if(!requiredRole.includes(user.role)){
        <Navigate to="/unauthorized" replace />;
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default RoleBasedRoutes