import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardOverview } from '../api/dashboardApi';
import MetricCard from '../components/MetricCard';
import BarChart from '../components/BarChart';
import Skeleton from '../components/Skeleton';
import { getErrorMessage } from '../utils/helpers';
import { showToast } from '../utils/notifications';

export default function AdminDashboard() {
	const { user } = useAuth();
	const [overview, setOverview] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const loadOverview = async () => {
			setLoading(true);
			try {
				const response = await fetchDashboardOverview();
				setOverview(response.data?.data?.overview || null);
			} catch (error) {
				const message = getErrorMessage(error, 'Unable to load admin overview');
				setErrorMessage(message);
				showToast({ tone: 'error', title: 'Admin dashboard', message });
			} finally {
				setLoading(false);
			}
		};

		loadOverview();
	}, []);

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 shadow-2xl shadow-cyan-950/20">
				<p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin</p>
				<h1 className="mt-3 text-3xl font-bold text-white">Administration console</h1>
				<p className="mt-3 max-w-2xl text-slate-300">
					Signed in as {user?.name}. Admin-only routes are protected by JWT and role checks.
				</p>
			</div>

			{errorMessage ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-200">{errorMessage}</div> : null}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{loading
					? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)
					: [
						{ label: 'Employees', value: overview?.metrics?.totalEmployees ?? '—', caption: 'Total people', accent: 'cyan' },
						{ label: 'Departments', value: overview?.metrics?.totalDepartments ?? '—', caption: 'Configured teams', accent: 'emerald' },
						{ label: 'Kudos', value: overview?.metrics?.totalKudos ?? '—', caption: 'Recognition messages', accent: 'amber' },
						{ label: 'Unread alerts', value: overview?.metrics?.unreadNotifications ?? '—', caption: 'Notifications pending', accent: 'rose' }
					  ].map((card) => (
						<MetricCard key={card.label} {...card} />
					  ))}
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<BarChart
					title="Department breakdown"
					description="Highest employee concentration by department."
					data={overview?.charts?.departmentBreakdown || []}
					tone="rose"
				/>
				<BarChart
					title="Activity trend"
					description="Recent kudos volume over the last week."
					data={overview?.charts?.activity || []}
					tone="amber"
				/>
			</div>
		</section>
	);
}
