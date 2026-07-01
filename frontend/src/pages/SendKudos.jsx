import { useEffect, useState } from 'react';
import { fetchEmployeeDirectory } from '../api/userApi';
import { submitKudosRequest } from '../api/kudosApi';
import KudosForm from '../components/KudosForm';
import Loader from '../components/Loader';
import { getErrorMessage } from '../utils/helpers';
import { showToast } from '../utils/notifications';
import { useAuth } from '../context/AuthContext';

export default function SendKudos() {
	const { user } = useAuth();
	const [employees, setEmployees] = useState([]);
	const [loadingEmployees, setLoadingEmployees] = useState(true);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		const loadEmployees = async () => {
			try {
				const response = await fetchEmployeeDirectory({ page: 1, limit: 100, sortBy: 'name', sortOrder: 'asc' });
				setEmployees(response.data?.data?.users || []);
			} catch (error) {
				const message = getErrorMessage(error, 'Unable to load employees');
				setErrorMessage(message);
				showToast({ tone: 'error', title: 'Employee loading failed', message });
			} finally {
				setLoadingEmployees(false);
			}
		};

		loadEmployees();
	}, []);

	const handleSubmit = async (values) => {
		setSuccessMessage('');
		setErrorMessage('');
		return submitKudosRequest(values);
	};

	return (
		<section className="grid gap-6 lg:grid-cols-[1fr_420px]">
			<div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
				<p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Recognition</p>
				<h1 className="text-3xl font-bold text-white">Send appreciation</h1>
				<p className="max-w-2xl text-slate-300">
					Choose a teammate, write a message up to 500 characters, and submit kudos. The recipient will be notified.
				</p>

				<div className="grid gap-4 md:grid-cols-2">
					<div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
						<p className="text-slate-400">Logged in as</p>
						<p className="mt-2 font-semibold text-white">{user?.name}</p>
					</div>
					<div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
						<p className="text-slate-400">Department</p>
						<p className="mt-2 font-semibold text-white">{user?.department || 'Unassigned'}</p>
					</div>
				</div>
			</div>

			{loadingEmployees ? (
				<Loader label="Loading employees..." />
			) : (
				<KudosForm
					employees={employees}
					currentUserId={user?.id}
					onSubmit={handleSubmit}
					onSuccess={() => {
						setErrorMessage('');
						setSuccessMessage('Kudos submitted successfully');
						showToast({ tone: 'success', title: 'Kudos sent', message: 'Your message was shared with the team.' });
					}}
					onError={(error) => {
						setSuccessMessage('');
						setErrorMessage(getErrorMessage(error, 'Unable to submit kudos'));
						showToast({ tone: 'error', title: 'Kudos not sent', message: getErrorMessage(error, 'Unable to submit kudos') });
					}}
					loading={loadingEmployees}
					successMessage={successMessage}
					errorMessage={errorMessage}
				/>
			)}
		</section>
	);
}