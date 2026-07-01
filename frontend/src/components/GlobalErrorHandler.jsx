import { useEffect } from 'react';
import { showToast } from '../utils/notifications';

export default function GlobalErrorHandler() {
	useEffect(() => {
		const handleError = (event) => {
			const message = event?.error?.message || event.message || 'Unexpected application error';
			showToast({ tone: 'error', title: 'Application error', message });
		};

		const handleUnhandledRejection = (event) => {
			const message = event?.reason?.message || 'A background request failed';
			showToast({ tone: 'error', title: 'Request error', message });
		};

		window.addEventListener('error', handleError);
		window.addEventListener('unhandledrejection', handleUnhandledRejection);

		return () => {
			window.removeEventListener('error', handleError);
			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		};
	}, []);

	return null;
}