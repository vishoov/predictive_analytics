// src/utils/analytics.utils.jsx
import api from '../utils/axios.utils.jsx';

// Dashboard-related endpoints
export const dashboardAPI = {
    // GET http://localhost:3000/view/uro_reports/stats/dashboard
    getStats: () => api.get('/view/uro_reports/stats/dashboard'),

    // GET http://localhost:3000/view/uro_reports/recent?limit=4
    getRecentTests: (limit = 4) =>
        api.get(`/view/uro_reports/recent?limit=${limit}`),

    // GET http://localhost:3000/view/uro_reports/stats/trends
    getTrends: () => api.get('/view/uro_reports/stats/trends'),

    // GET http://localhost:3000/view/uro_reports/stats/patients
    getPatientStats: () => api.get('/view/uro_reports/stats/patients'),
};

// Report-related endpoints
export const reportsAPI = {
    // GET http://localhost:3000/view/uro_reports?page=1&limit=10
    getAll: (page = 1, limit = 10) =>
        api.get(`/view/uro_reports?page=${page}&limit=${limit}`),

    // GET http://localhost:3000/view/uro_reports/search (with filters)
    search: (params) => 
        api.get('/view/uro_reports/search', { params }),

    // GET http://localhost:3000/view/uro_reports/:id
    getById: (id) => api.get(`/view/uro_reports/${id}`),

    // GET http://localhost:3000/view/uro_reports/patient/:patientId
    getByPatient: (patientId) =>
        api.get(`/view/uro_reports/patient/${patientId}`),

    // GET http://localhost:3000/view/uro_reports/count
    getCount: () => api.get('/view/uro_reports/count'),

    // POST http://localhost:3000/view/uro_reports
    create: (data) => api.post('/view/uro_reports', data),

    // POST http://localhost:3000/view/uro_reports/upload (multipart/form-data)
    uploadCSV: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/view/uro_reports/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // DELETE http://localhost:3000/view/uro_reports
    deleteAll: () => api.delete('/view/uro_reports'),

    // POST http://localhost:3000/view/uro_reports/fill
    fill: (data) => api.post('/view/uro_reports/fill', data),

    // PUT http://localhost:3000/view/uro_reports/:id - FIXED
    update: (id, data) => api.put(`/view/uro_reports/${id}`, data),
};

// Disease-related endpoints
export const diseaseAPI = {
    getAll: () => api.get('/view/uro_reports/diseases/list'),
    
    getByDisease: (disease, page = 1, limit = 10) => 
        api.get(`/view/uro_reports/diseases/${encodeURIComponent(disease)}?page=${page}&limit=${limit}`),
    
    // GET http://localhost:3000/view/uro_reports/diseases/statistics
    getStatistics: () => api.get('/view/uro_reports/diseases/statistics'),
    
    // GET http://localhost:3000/view/uro_reports/diseases/patients/:diseaseCode
    getPatientsByDisease: (diseaseCode, page = 1, limit = 10) => 
        api.get(`/view/uro_reports/diseases/patients/${diseaseCode}?page=${page}&limit=${limit}`),
};

export const analyticsAPI = {
    getDashboard: () => api.get('/api/analytics/dashboard'),
};

export default api;
