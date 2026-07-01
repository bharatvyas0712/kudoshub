import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MainLayout() {
	return (
		<div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
			<Navbar />
			<main className="mx-auto max-w-6xl px-6 py-8">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
