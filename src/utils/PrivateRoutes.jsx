import React from 'react'
import { useAuth } from '../context/authContext.jsx';
import { Navigate } from 'react-router-dom';
const PrivateRoutes = ({children}) => {
    const {user, isLoading} = useAuth();

    if(isLoading){
        return <div>Loading...</div>
    }

    return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoutes