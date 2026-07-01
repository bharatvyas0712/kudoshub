import { useEffect, useMemo, useState } from 'react';
import KudosCard from '../components/KudosCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import Skeleton from '../components/Skeleton';
import useDebounce from '../hooks/useDebounce';
import { fetchPublicKudosFeed } from '../api/kudosApi';
import { getErrorMessage } from '../utils/helpers';
import { showToast } from '../utils/notifications';

export default function KudosFeed() {
	const [kudos, setKudos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
	const [errorMessage, setErrorMessage] = useState('');
	const debouncedSearch = useDebounce(search, 350);

	const query = useMemo(
		() => ({
			search: debouncedSearch,
			page,
			limit: 8
		}),
		[debouncedSearch, page]
	);

	useEffect(() => {
		const loadFeed = async () => {
			setLoading(true);
			setErrorMessage('');
			try {
				const response = await fetchPublicKudosFeed(query);
				setKudos(response.data?.data?.kudos || []);
				setMeta(response.data?.meta || { page: 1, totalPages: 1, total: 0 });
			} catch (error) {
				const message = getErrorMessage(error, 'Unable to load the public feed');
				setErrorMessage(message);
				showToast({ tone: 'error', title: 'Feed error', message });
			} finally {
				setLoading(false);
			}
		};

		loadFeed();
	}, [query]);

	return (
		<section className="space-y-6">
			<div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
				<p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Public Feed</p>
				<h1 className="mt-2 text-3xl font-bold text-white">Newest kudos first</h1>
				<p className="mt-2 max-w-2xl text-slate-300">
					Everyone can read the latest appreciation messages here.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-[1fr_auto]">
				<SearchBar value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search message or employee" />
				<div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-400">
					{meta.total} total kudos
				</div>
			</div>

			{errorMessage ? <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-200">{errorMessage}</div> : null}

			<div className="space-y-4">
				{loading ? (
					Array.from({ length: 3 }).map((_, index) => (
						<div key={index} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/10">
							<div className="flex items-start gap-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="flex-1 space-y-3">
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-20 w-full" />
									<Skeleton className="h-4 w-1/3" />
								</div>
							</div>
						</div>
					))
				) : kudos.length > 0 ? (
					kudos.map((item) => <KudosCard key={item.id} kudos={item} />)
				) : (
					<div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">No kudos found.</div>
				)}
			</div>

			<Pagination page={meta.page || 1} totalPages={meta.totalPages || 1} onPageChange={setPage} />
		</section>
	);
}