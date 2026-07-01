const barTheme = {
	cyan: 'bg-cyan-400',
	emerald: 'bg-emerald-400',
	rose: 'bg-rose-400',
	amber: 'bg-amber-400'
};

export default function BarChart({ title, description, data = [], tone = 'cyan', emptyMessage = 'No chart data available' }) {
	const maxValue = Math.max(...data.map((item) => item.value), 1);

	return (
		<div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/10">
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-white">{title}</h3>
				{description ? <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p> : null}
			</div>

			{data.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-center text-slate-400">{emptyMessage}</div>
			) : (
				<div className="space-y-4">
					{data.map((item) => (
						<div key={item.label} className="space-y-2">
							<div className="flex items-center justify-between gap-4 text-sm">
								<span className="font-medium text-slate-200">{item.label}</span>
								<span className="text-slate-400">{item.value}</span>
							</div>
							<div className="h-3 overflow-hidden rounded-full bg-slate-800">
								<div className={`h-full rounded-full ${barTheme[tone] || barTheme.cyan}`} style={{ width: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)}%` }} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}