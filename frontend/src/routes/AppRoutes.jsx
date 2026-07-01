import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayout';
import AdminDashboard from '../pages/AdminDashboard';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import KudosFeed from '../pages/KudosFeed';
import MyKudos from '../pages/MyKudos';
import SendKudos from '../pages/SendKudos';
import Profile from '../pages/Profile';
import Register from '../pages/Register';

function LandingPage() {
	return (
		<main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
			<Navbar />
			<section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 overflow-hidden px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_60%)]" />
				<div className="space-y-8">
					<p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
						Employee recognition platform
					</p>
					<div className="space-y-5">
						<h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
							Recognition that feels immediate, visual, and shared.
						</h1>
						<p className="max-w-2xl text-lg leading-8 text-slate-300">
							KudosHub combines authentication, employee profiles, kudos sharing, dashboards, and production-ready UI patterns in one workspace.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Link to="/login" className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
							Login
						</Link>
						<Link to="/register" className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-200">
							Register
						</Link>
						<Link to="/kudos/feed" className="rounded-full border border-cyan-400/30 bg-cyan-400/5 px-5 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-400/10">
							View feed
						</Link>
					</div>
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
							<p className="text-sm text-slate-400">Real-time</p>
							<p className="mt-2 text-lg font-semibold text-white">Toast + error handling</p>
						</div>
						<div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
							<p className="text-sm text-slate-400">Responsive</p>
							<p className="mt-2 text-lg font-semibold text-white">Mobile-first layouts</p>
						</div>
						<div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
							<p className="text-sm text-slate-400">Analytics</p>
							<p className="mt-2 text-lg font-semibold text-white">Dashboard charts</p>
						</div>
					</div>
				</div>
				<div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
					<div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
						<p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Project state</p>
						<div className="space-y-3 text-sm text-slate-300">
							<p>Auth, employee, and kudos flows are implemented.</p>
							<p>Shared UI handles loading, toast, error, and theme concerns.</p>
							<p>Docker and deployment docs are included for production handoff.</p>
						</div>
					</div>
					<div className="mt-5 grid grid-cols-2 gap-4">
						<div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
							<p className="text-sm text-slate-400">Security</p>
							<p className="mt-2 text-2xl font-bold text-white">Helmet + CORS</p>
						</div>
						<div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
							<p className="text-sm text-slate-400">Reliability</p>
							<p className="mt-2 text-2xl font-bold text-white">Rate limiting</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route element={<MainLayout />}>
				<Route path="/kudos/feed" element={<KudosFeed />} />
			</Route>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			<Route element={<ProtectedRoute />}>
				<Route element={<MainLayout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/kudos/send" element={<SendKudos />} />
					<Route path="/kudos/my-kudos" element={<MyKudos />} />
				</Route>
			</Route>

			<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
				<Route element={<AdminLayout />}>
					<Route path="/admin" element={<AdminDashboard />} />
				</Route>
			</Route>

			<Route path="/not-found" element={<NotFound />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
