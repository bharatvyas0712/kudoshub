import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

if (typeof window !== 'undefined') {
	window.document.documentElement.dataset.theme = window.localStorage.getItem('kudoshub.theme') || 'dark';
	window.document.documentElement.style.colorScheme = window.document.documentElement.dataset.theme;
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
