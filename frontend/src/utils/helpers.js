import { STORAGE_KEYS } from './constants';

export const readJson = (value, fallback = null) => {
	if (typeof value !== 'string' || value.length === 0) {
		return fallback;
	}

	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
};

export const getStoredAuth = () => {
	if (typeof window === 'undefined') {
		return { token: null, user: null };
	}

	return {
		token: window.localStorage.getItem(STORAGE_KEYS.TOKEN),
		user: readJson(window.localStorage.getItem(STORAGE_KEYS.USER))
	};
};

export const persistAuth = ({ token, user }) => {
	window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
	window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const clearAuth = () => {
	window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
	window.localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
	error?.response?.data?.message || error?.message || fallback;
