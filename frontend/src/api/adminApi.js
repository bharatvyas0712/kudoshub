import api from './axios';

export const fetchAdminProfile = () => api.get('/admin/me');
