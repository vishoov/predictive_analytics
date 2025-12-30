import React, { useState, createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/axios.utils.jsx'; // Import the axios instance with interceptor

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       

        const verifyUser = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    console.log('No token found in localStorage');
                    setIsLoading(false);
                    return;
                }
        
                // Now the interceptor automatically adds the Authorization header
                const response = await api.post('/users/verify');
        
                if (response.data.success) {
                    setUser(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
            } catch (err) {
                if(err.response && err.response.status === 401) {
                console.error('Verification error:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                setUser(null);
                } else {
                    console.error('An unexpected error occurred during verification:', err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        verifyUser();
    }, []); // Empty dependency array - only run once on mount

    const login = useCallback((data) => {
        if (!data || !data.token || !data.user) {
            console.error('Invalid login data provided');
            return;
        }
        
        setUser(data.user);
        localStorage.setItem('token', data.token);
        console.log('User logged in:', data.user, data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const isAuthenticated = useCallback(() => {
        return !!user;
    }, [user]);

    const value = useMemo(() => ({
        user,
        login,
        logout,
        isAuthenticated,
        isLoading
    }), [user, login, logout, isAuthenticated, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
