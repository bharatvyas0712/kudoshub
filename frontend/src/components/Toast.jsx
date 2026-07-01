import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { TOAST_EVENT_NAME } from '../utils/notifications';

const ToastContext = createContext(null);

const toneClasses = {
	success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100',
	error: 'border-rose-500/20 bg-rose-500/10 text-rose-100',
	warning: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
	info: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-100'
};

const iconMap = {
	success: '✓',
	error: '!',
	warning: '⚠',
	info: 'i'
};

function ToastViewport({ toasts, onDismiss }) {
	if (toasts.length === 0) {
		return null;
	}

	return createPortal(
		<div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,24rem)] flex-col gap-3">
			{toasts.map((toast) => (
				<div key={toast.id} className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl backdrop-blur ${toneClasses[toast.tone] || toneClasses.info}`}>
					<div className="flex items-start gap-3">
						<div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-sm font-bold">
							{iconMap[toast.tone] || iconMap.info}
						</div>
						<div className="min-w-0 flex-1">
							{toast.title ? <p className="font-semibold">{toast.title}</p> : null}
							{toast.message ? <p className="mt-1 text-sm leading-6 opacity-90">{toast.message}</p> : null}
						</div>
						<button type="button" onClick={() => onDismiss(toast.id)} className="rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100">
							Dismiss
						</button>
					</div>
				</div>
			))}
		</div>,
		document.body
	);
}

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	useEffect(() => {
		const handleToast = (event) => {
			const nextToast = event.detail;
			setToasts((current) => [...current, nextToast]);

			if (nextToast.duration !== 0) {
				window.setTimeout(() => {
					setToasts((current) => current.filter((toast) => toast.id !== nextToast.id));
				}, nextToast.duration || 4000);
			}
		};

		window.addEventListener(TOAST_EVENT_NAME, handleToast);
		return () => window.removeEventListener(TOAST_EVENT_NAME, handleToast);
	}, []);

	const removeToast = (toastId) => {
		setToasts((current) => current.filter((toast) => toast.id !== toastId));
	};

	const value = useMemo(
		() => ({
			show: (toast) => {
				window.dispatchEvent(new CustomEvent(TOAST_EVENT_NAME, { detail: toast }));
			}
		}),
		[]
	);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastViewport toasts={toasts} onDismiss={removeToast} />
		</ToastContext.Provider>
	);
}

export const useToast = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}

	return context;
};

export const toastPresets = {
	success: { tone: 'success', title: 'Success' },
	error: { tone: 'error', title: 'Error' },
	warning: { tone: 'warning', title: 'Warning' },
	info: { tone: 'info', title: 'Info' }
};