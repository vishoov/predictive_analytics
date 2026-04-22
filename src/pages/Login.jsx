import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Only redirect authenticated users, don't redirect when no user
        if (!authLoading && user && !hasRedirected.current) {
            hasRedirected.current = true;
            if (user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else {
                navigate('/user-dashboard', { replace: true });
            }
        }
    }, [user, authLoading]); // Removed navigate from dependencies

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const api = import.meta.env.API || 'http://localhost:3000';
        console.log('API Base URL:', api);

        try {
            const response = await axios.post(`${api}/users/login`, {
                email,
                password
            });
            console.log('API Response:', response.data);
            
            // console.log('Login successful', response.data);
            
            // Store token and update auth context
            localStorage.setItem('token', response.data.token);
            login(response.data);
            
            // Navigate based on user role
            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard', { replace: true });
            } else {
                navigate('/user-dashboard', { replace: true });
            }
            
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                setError(error.response.data?.message || 'Login failed. Please try again.');
                console.error('Server Error:', error.response.status);
                console.error('Error Data:', error.response.data);
            } else if (error.request) {
                setError('Unable to connect to server. Please check your internet connection.');
                console.error('No Response:', error.request);
            } else {
                setError('An unexpected error occurred. Please try again.');
                console.error('Error:', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Welcome Back</h2>
                <p className="mt-1 text-sm text-center text-gray-500">Login to your account</p>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}
        
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-sm text-gray-600">
                            <input 
                                type="checkbox" 
                                className="text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                disabled={isLoading}
                            />
                            <span className="ml-2">Remember me</span>
                        </label>
                        <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
