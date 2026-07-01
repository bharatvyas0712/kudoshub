import api from './axios';

export const registerRequest = (payload) => api.post('/auth/register', payload);
export const loginRequest = (payload) => api.post('/auth/login', payload);
export const logoutRequest = () => api.post('/auth/logout');
export const fetchCurrentUser = () => api.get('/auth/me');
