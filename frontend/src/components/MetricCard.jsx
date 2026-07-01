export default function MetricCard({ label, value, caption, accent = 'cyan' }) {
	const accentClasses = {
		cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-400/20',
		emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/20',
		rose: 'from-rose-500/20 to-rose-500/5 border-rose-400/20',
		amber: 'from-amber-500/20 to-amber-500/5 border-amber-400/20'
	};

	return (
		<div className={`rounded-3xl border bg-gradient-to-br p-5 shadow-2xl shadow-cyan-950/10 ${accentClasses[accent] || accentClasses.cyan}`}>
			<p className="text-sm text-slate-300/80">{label}</p>
			<p className="mt-3 text-3xl font-bold text-white">{value}</p>
			{caption ? <p className="mt-2 text-sm text-slate-300">{caption}</p> : null}
		</div>
	);
}