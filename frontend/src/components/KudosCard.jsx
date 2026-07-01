import { ASSET_BASE_URL } from '../utils/constants';

const formatDate = (value) =>
	new Intl.DateTimeFormat('en', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(value));

const initials = (name) =>
	name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');

const Avatar = ({ user }) => {
	if (user?.profileImage) {
		return <img src={`${ASSET_BASE_URL}${user.profileImage}`} alt={user.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-400/20" />;
	}

	return <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-200">{initials(user?.name || 'Kudos')}</div>;
};

export default function KudosCard({ kudos, compact = false }) {
	return (
		<article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/10">
			<div className="flex items-start gap-4">
				<Avatar user={kudos.sender} />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
						<span className="font-semibold text-white">{kudos.sender?.name}</span>
						<span>to</span>
						<span className="font-semibold text-white">{kudos.receiver?.name}</span>
						<span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-slate-400">
							{compact ? 'Personal' : 'Public'}
						</span>
					</div>
					<p className="mt-3 whitespace-pre-wrap break-words text-slate-200">{kudos.message}</p>
					<div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
						<span>{formatDate(kudos.createdAt)}</span>
						{kudos.sender?.department ? <span>{kudos.sender.department}</span> : null}
						{compact && kudos.receiver?.department ? <span>{kudos.receiver.department}</span> : null}
					</div>
				</div>
			</div>
		</article>
	);
}