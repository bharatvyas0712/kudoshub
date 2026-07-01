export default function EmployeeDropdown({ employees, value, onChange, currentUserId, placeholder = 'Select employee' }) {
	return (
		<select
			value={value}
			onChange={(event) => onChange(event.target.value)}
			disabled={placeholder.toLowerCase().includes('loading')}
			className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
		>
			<option value="">{placeholder}</option>
			{employees
				.filter((employee) => employee.id !== currentUserId)
				.map((employee) => (
					<option key={employee.id} value={employee.id}>
						{employee.name} {employee.department ? `· ${employee.department}` : ''}
					</option>
				))}
		</select>
	);
}