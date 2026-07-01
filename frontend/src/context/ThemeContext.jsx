import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
	if (typeof window === 'undefined') {
		return 'dark';
	}

	return window.localStorage.getItem('kudoshub.theme') || 'dark';
};

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(getInitialTheme);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		window.localStorage.setItem('kudoshub.theme', theme);
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme;
	}, [theme]);

	const toggleTheme = () => {
		setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
	};

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			toggleTheme
		}),
		[theme]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};
