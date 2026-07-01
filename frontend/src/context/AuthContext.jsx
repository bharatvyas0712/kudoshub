import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginRequest, logoutRequest, registerRequest } from '../api/authApi';
import { clearAuth, getStoredAuth, persistAuth } from '../utils/helpers';
import { showToast } from '../utils/notifications';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);

	const hydrateSession = async () => {
		const stored = getStoredAuth();

		if (!stored.token || !stored.user) {
			setLoading(false);
			return;
		}

		setToken(stored.token);
		setUser(stored.user);

		try {
			const response = await fetchCurrentUser();
			const currentUser = response.data?.data?.user;

			if (currentUser) {
				setUser(currentUser);
				persistAuth({ token: stored.token, user: currentUser });
			}
		} catch (error) {
			if (error?.response?.status === 401) {
				clearAuth();
				setToken(null);
				setUser(null);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		hydrateSession();

		const handleAuthExpired = () => {
			clearAuth();
			setToken(null);
			setUser(null);
		};

		window.addEventListener('kudoshub:auth-expired', handleAuthExpired);

		return () => {
			window.removeEventListener('kudoshub:auth-expired', handleAuthExpired);
		};
	}, []);

	const saveSession = (session) => {
		setToken(session.token);
		setUser(session.user);
		persistAuth(session);
	};

	const syncUser = (nextUser) => {
		setUser(nextUser);
		if (token) {
			persistAuth({ token, user: nextUser });
		}
	};

	const login = async (credentials) => {
		const response = await loginRequest(credentials);
		const session = response.data?.data;
		saveSession(session);
		showToast({ tone: 'success', title: 'Welcome back', message: 'You are signed in.' });
		return session.user;
	};

	const register = async (payload) => {
		const response = await registerRequest(payload);
		const session = response.data?.data;
		saveSession(session);
		showToast({ tone: 'success', title: 'Account created', message: 'Your workspace is ready.' });
		return session.user;
	};

	const logout = async (options = {}) => {
		if (!options.silent) {
			try {
				await logoutRequest();
			} catch {
				// Logout is still completed locally when the API is unavailable.
			}
		}

		clearAuth();
		setToken(null);
		setUser(null);

		if (!options.silent) {
			showToast({ tone: 'info', title: 'Signed out', message: 'Your session was cleared.' });
		}
	};

	const refreshUser = async () => {
		const response = await fetchCurrentUser();
		const currentUser = response.data?.data?.user;
		if (currentUser) {
			syncUser(currentUser);
		}
		return currentUser;
	};

	const value = useMemo(
		() => ({
			user,
			token,
			loading,
			isAuthenticated: Boolean(token && user),
			isAdmin: user?.role === 'ADMIN',
			login,
			register,
			syncUser,
			refreshUser,
			logout
		}),
		[user, token, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
};
