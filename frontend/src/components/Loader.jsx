import Spinner from './Spinner';

export default function Loader({ fullScreen = false, label = 'Loading...' }) {
	return (
		<div
			className={`grid place-items-center ${fullScreen ? 'min-h-screen' : 'py-10'} text-slate-100`}
		>
			<div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-2xl shadow-cyan-950/30">
				<Spinner size="sm" />
				<span className="text-sm font-medium text-slate-200">{label}</span>
			</div>
		</div>
	);
}
