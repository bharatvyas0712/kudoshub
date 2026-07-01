import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<main className="grid min-h-screen place-items-center px-6 text-slate-100">
			<div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-900/75 p-8 text-center shadow-2xl shadow-cyan-950/20">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">404</p>
				<h1 className="mt-4 text-3xl font-bold text-white">Page not found</h1>
				<p className="mt-3 text-slate-300">The page you are looking for does not exist or has moved.</p>
				<div className="mt-6 flex flex-wrap justify-center gap-3">
					<Link to="/" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
						Go home
					</Link>
					<Link to="/dashboard" className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-200">
						Dashboard
					</Link>
				</div>
			</div>
		</main>
	);
}
