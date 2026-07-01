import api from './axios';

export const fetchDashboardOverview = () => api.get('/dashboard/overview');