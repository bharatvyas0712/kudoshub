export default function Pagination({ page, totalPages, onPageChange }) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm text-slate-300 shadow-2xl shadow-cyan-950/10">
			<p>
				Page <span className="font-semibold text-white">{page}</span> of{' '}
				<span className="font-semibold text-white">{totalPages}</span>
			</p>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => onPageChange(page - 1)}
					disabled={page <= 1}
					className="rounded-full border border-slate-700 px-4 py-2 font-medium text-white transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Previous
				</button>
				<button
					type="button"
					onClick={() => onPageChange(page + 1)}
					disabled={page >= totalPages}
					className="rounded-full border border-slate-700 px-4 py-2 font-medium text-white transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Next
				</button>
			</div>
		</div>
	);
}
