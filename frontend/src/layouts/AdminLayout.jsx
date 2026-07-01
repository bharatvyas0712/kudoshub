import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
	return (
		<div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
			<Navbar />
			<main className="mx-auto max-w-6xl px-6 py-8">
				<div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100">
					Admin access area
				</div>
				<Outlet />
			</main>
		</div>
	);
}
