export default function Spinner({ size = 'md', className = '' }) {
	const dimensions = {
		sm: 'h-4 w-4 border-2',
		md: 'h-6 w-6 border-2',
		lg: 'h-10 w-10 border-[3px]'
	};

	return <span className={`inline-block animate-spin rounded-full border-cyan-400 border-t-transparent ${dimensions[size] || dimensions.md} ${className}`} />;
}