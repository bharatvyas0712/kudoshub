import { ASSET_BASE_URL } from '../utils/constants';
import Skeleton from './Skeleton';

const formatDate = (value) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));

const getInitials = (name) =>
	name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');

export default function EmployeeTable({ employees, loading }) {
	if (loading) {
		return (
			<div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-cyan-950/20">
				<div className="space-y-4">
					{Array.from({ length: 4 }).map((_, index) => (
						<div key={index} className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
							<Skeleton className="h-11 w-full" />
							<Skeleton className="h-11 w-full" />
							<Skeleton className="h-11 w-full" />
							<Skeleton className="h-11 w-full" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (employees.length === 0) {
		return <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">No employees found.</div>;
	}

	return (
		<div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-cyan-950/20">
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-slate-800 text-left text-sm">
					<thead className="bg-slate-950/60 text-slate-300">
						<tr>
							<th className="px-5 py-4 font-semibold">Employee</th>
							<th className="px-5 py-4 font-semibold">Department</th>
							<th className="px-5 py-4 font-semibold">Email</th>
							<th className="px-5 py-4 font-semibold">Joined</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-800">
						{employees.map((employee) => (
							<tr key={employee.id} className="hover:bg-slate-800/50">
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										{employee.profileImage ? (
											<img
												src={`${ASSET_BASE_URL}${employee.profileImage}`}
												alt={employee.name}
												className="h-11 w-11 rounded-full object-cover ring-2 ring-cyan-400/20"
											/>
										) : (
											<div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">
												{getInitials(employee.name)}
											</div>
										)}
										<div>
											<p className="font-semibold text-white">{employee.name}</p>
											<p className="text-xs uppercase tracking-[0.2em] text-slate-400">{employee.role}</p>
										</div>
									</div>
								</td>
								<td className="px-5 py-4 text-slate-300">{employee.department || 'Unassigned'}</td>
								<td className="px-5 py-4 text-slate-300">{employee.email}</td>
								<td className="px-5 py-4 text-slate-300">{formatDate(employee.createdAt)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}