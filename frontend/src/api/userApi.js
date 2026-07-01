import api from './axios';

export const fetchEmployeeDirectory = (params) => api.get('/users', { params });
export const fetchEmployeeProfile = () => api.get('/users/me');
export const updateEmployeeProfile = (formData) =>
	api.patch('/users/me', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	});
export const fetchDepartments = () => api.get('/users/departments');