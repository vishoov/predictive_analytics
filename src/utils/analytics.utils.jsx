// src/utils/analytics.utils.jsx
import api from '../utils/axios.utils.jsx';

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
    getStats:       () => api.get('/view/uro_reports/stats/dashboard'),
    getRecentTests: (limit = 4) => api.get(`/view/uro_reports/recent?limit=${limit}`),
    getTrends:      () => api.get('/view/uro_reports/stats/trends'),
    getPatientStats:() => api.get('/view/uro_reports/stats/patients'),
};

// ── Reports ───────────────────────────────────────────────────────────────────
export const reportsAPI = {
    getAll:     (page = 1, limit = 10) => api.get(`/view/uro_reports?page=${page}&limit=${limit}`),
    search:     (params) => api.get('/view/uro_reports/search', { params }),
    getById:    (id) => api.get(`/view/uro_reports/${id}`),
    getByPatient:(patientId) => api.get(`/view/uro_reports/patient/${patientId}`),
    getCount:   () => api.get('/view/uro_reports/count'),
    create:     (data) => api.post('/view/uro_reports', data),
    update:     (id, data) => api.put(`/view/uro_reports/${id}`, data),
    deleteAll:  () => api.delete('/view/uro_reports'),
    fill:       (data) => api.post('/view/uro_reports/fill', data),

    uploadCSV: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/view/uro_reports/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    // ── Image routes ──────────────────────────────────────────────────────────
    uploadImages: (reportId, files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        return api.post(`/reports/upload/${reportId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteImage: (reportId, publicId) =>
        api.delete(`/reports/images/${reportId}/${encodeURIComponent(publicId)}`),

    // ── Status route ──────────────────────────────────────────────────────────
    updateStatus: (reportId, status) =>
        api.patch(`/reports/status/${reportId}`, { status }),
};

// ── Diseases ──────────────────────────────────────────────────────────────────
export const diseaseAPI = {
    getAll:            () => api.get('/view/uro_reports/diseases/list'),
    getStatistics:     () => api.get('/view/uro_reports/diseases/statistics'),

    getByDisease: (disease, page = 1, limit = 10) =>
        api.get(`/view/uro_reports/diseases/${encodeURIComponent(disease)}?page=${page}&limit=${limit}`),

    getPatientsByDisease: (diseaseCode, page = 1, limit = 10) =>
        api.get(`/view/uro_reports/diseases/patients/${diseaseCode}?page=${page}&limit=${limit}`),
};

export default api;
