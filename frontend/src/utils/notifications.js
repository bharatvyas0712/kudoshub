const TOAST_EVENT = 'kudoshub:toast';

export const showToast = ({ title = '', message = '', tone = 'info', duration = 4000 }) => {
	if (typeof window === 'undefined') {
		return;
	}

	const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
	window.dispatchEvent(
		new CustomEvent(TOAST_EVENT, {
			detail: {
				id,
				title,
				message,
				tone,
				duration
			}
		})
	);
};

export const TOAST_EVENT_NAME = TOAST_EVENT;