import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDepartments, fetchEmployeeDirectory } from '../api/userApi';
import { fetchDashboardOverview } from '../api/dashboardApi';
import EmployeeTable from '../components/EmployeeTable';
import BarChart from '../components/BarChart';
import MetricCard from '../components/MetricCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import { getErrorMessage } from '../utils/helpers';
import { showToast } from '../utils/notifications';

const sortOptions = [
	{ label: 'Newest', value: 'createdAt:desc' },
	{ label: 'Name A-Z', value: 'name:asc' },
	{ label: 'Name Z-A', value: 'name:desc' },
	{ label: 'Department A-Z', value: 'department:asc' }
];

export default function Dashboard() {
	const { user, isAdmin } = useAuth();
	const [employees, setEmployees] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [overviewLoading, setOverviewLoading] = useState(true);
	const [overview, setOverview] = useState(null);
	const [search, setSearch] = useState('');
	const [department, setDepartment] = useState('');
	const [sort, setSort] = useState('createdAt:desc');
	const [page, setPage] = useState(1);
	const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
	const [errorMessage, setErrorMessage] = useState('');
	const debouncedSearch = useDebounce(search, 350);

	const [sortBy, sortOrder] = sort.split(':');

	const query = useMemo(
		() => ({
			search: debouncedSearch,
			department,
			sortBy,
			sortOrder,
			page,
			limit: 8
		}),
		[debouncedSearch, department, sortBy, sortOrder, page]
	);

	useEffect(() => {
		let active = true;

		const loadData = async () => {
			setLoading(true);
			setErrorMessage('');

			try {
				const response = await fetchEmployeeDirectory(query);
				if (!active) {
					return;
				}

				setEmployees(response.data?.data?.users || []);
				setMeta(response.data?.meta || { page: 1, totalPages: 1, total: 0 });
			} catch (error) {
				if (!active) {
					return;
				}

				const message = getErrorMessage(error, 'Unable to load the employee directory');
				setErrorMessage(message);
				showToast({ tone: 'error', title: 'Directory error', message });
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		};

		loadData();

		return () => {
			active = false;
		};
	}, [query]);

	useEffect(() => {
		let active = true;

		const loadOverview = async () => {
			setOverviewLoading(true);
			try {
				const response = await fetchDashboardOverview();
				if (active) {
					setOverview(response.data?.data?.overview || null);
				}
			} catch (error) {
				if (active) {
					const message = getErrorMessage(error, 'Unable to load dashboard metrics');
					showToast({ tone: 'error', title: 'Dashboard metrics', message });
				}
			} finally {
				if (active) {
					setOverviewLoading(false);
				}
			}
		};

		loadOverview();

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		let active = true;

		const loadDepartments = async () => {
			try {
				const response = await fetchDepartments();
				if (active) {
					setDepartments(response.data?.data?.departments || []);
				}
			} catch (error) {
				if (active) {
					const message = getErrorMessage(error, 'Unable to load departments');
					showToast({ tone: 'error', title: 'Department list', message });
				}
			}
		};

		loadDepartments();

		return () => {
			active = false;
		};
	}, []);

	const metricCards = useMemo(() => [
		{
			label: 'Employees',
			value: overview?.metrics?.totalEmployees ?? '—',
			caption: 'People active in the workspace',
			accent: 'cyan'
		},
		{
			label: 'Departments',
			value: overview?.metrics?.totalDepartments ?? '—',
			caption: 'Teams configured in the directory',
			accent: 'emerald'
		},
		{
			label: 'Kudos',
			value: overview?.metrics?.totalKudos ?? '—',
			caption: 'All-time appreciation messages',
			accent: 'amber'
		},
		{
			label: 'Unread alerts',
			value: overview?.metrics?.unreadNotifications ?? '—',
			caption: 'Pending notification count',
			accent: 'rose'
		}
	], [overview]);

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/20">
				<p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Employee Dashboard</p>
				<h1 className="mt-3 text-3xl font-bold text-white">Welcome back, {user?.name}</h1>
				<p className="mt-3 max-w-2xl text-slate-300">
					Browse the employee directory, filter by department, search by name or email, and switch
					between sorting modes.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{overviewLoading
					? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)
					: metricCards.map((card) => (
						<MetricCard key={card.label} label={card.label} value={card.value} caption={card.caption} accent={card.accent} />
					  ))}
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<Link to="/kudos/send" className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-5 transition hover:border-cyan-400/60 hover:bg-cyan-500/10">
					<p className="text-sm text-cyan-300">Quick action</p>
					<p className="mt-2 font-semibold text-white">Send Kudos</p>
				</Link>
				<Link to="/kudos/feed" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-400/60">
					<p className="text-sm text-slate-400">Quick action</p>
					<p className="mt-2 font-semibold text-white">Public Feed</p>
				</Link>
				<Link to="/kudos/my-kudos" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-400/60">
					<p className="text-sm text-slate-400">Quick action</p>
					<p className="mt-2 font-semibold text-white">My Kudos</p>
				</Link>
			</div>

			<div className="grid gap-4 lg:grid-cols-2">
				<BarChart
					title="Department distribution"
					description="Top departments by employee count."
					data={overview?.charts?.departmentBreakdown || []}
					tone="cyan"
				/>
				<BarChart
					title="Kudos activity"
					description="Messages created across the last seven days."
					data={overview?.charts?.activity || []}
					tone="emerald"
				/>
			</div>

			<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
				<p className="text-slate-400">Signed in as</p>
				<p className="mt-2 font-medium text-white">{isAdmin ? 'Admin' : 'Employee'}</p>
				<p className="mt-1 text-slate-400">Department: {user?.department || 'Unassigned'}</p>
			</div>

			{errorMessage ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-200">{errorMessage}</div> : null}

			<div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 lg:grid-cols-4">
				<SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
				<select value={department} onChange={(event) => { setDepartment(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
					<option value="">All departments</option>
					{departments.map((item) => (
						<option key={item.id} value={item.name}>{item.name}</option>
					))}
				</select>
				<select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value}>{option.label}</option>
					))}
				</select>
				<div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
					Page size 8
				</div>
			</div>

			<EmployeeTable employees={employees} loading={loading} />

			<Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onPageChange={setPage} />
		</section>
	);
}
