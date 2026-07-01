export default function SearchBar({ value, onChange, placeholder = 'Search employees...' }) {
	return (
		<div className="relative">
			<input
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-10 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
			/>
			<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
				Search
			</span>
		</div>
	);
}
