import api from './axios';

export const submitKudosRequest = (payload) => api.post('/kudos', payload);
export const fetchPublicKudosFeed = (params) => api.get('/kudos/feed', { params });
export const fetchSentKudos = (params) => api.get('/kudos/sent', { params });
export const fetchReceivedKudos = (params) => api.get('/kudos/received', { params });