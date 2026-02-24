import axios from 'axios';

// Create axios instance
const api = axios.create({

    baseURL: import.meta.env.API || 'https://data-backend-kappa.vercel.app/',
});

// Add token to all requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
