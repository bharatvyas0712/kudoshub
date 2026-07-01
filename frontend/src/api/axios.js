import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import { getErrorMessage } from '../utils/helpers';
import { showToast } from '../utils/notifications';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

api.interceptors.request.use((config) => {
	if (typeof window !== 'undefined') {
		const token = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (typeof window !== 'undefined' && error?.response?.status === 401) {
			window.dispatchEvent(new Event('kudoshub:auth-expired'));
		}

		if (typeof window !== 'undefined' && (!error?.response || error?.response?.status >= 500)) {
			showToast({
				tone: 'error',
				title: 'Request failed',
				message: getErrorMessage(error, 'Unable to complete the request')
			});
		}

		return Promise.reject(error);
	}
);

export default api;
