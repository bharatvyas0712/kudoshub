import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const linkClass = ({ isActive }) =>
	`transition-colors ${isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-white'}`;

export default function Navbar() {
	const navigate = useNavigate();
	const { user, isAuthenticated, isAdmin, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();

	const handleLogout = async () => {
		await logout();
		navigate('/login', { replace: true });
	};

	return (
		<header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
				<Link to="/" className="text-lg font-bold tracking-tight text-white">
					KudosHub
				</Link>
				<nav className="flex flex-wrap items-center gap-3 text-sm">
					<button
						type="button"
						onClick={toggleTheme}
						className="rounded-full border border-slate-700 px-4 py-2 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
					>
						{theme === 'dark' ? 'Light mode' : 'Dark mode'}
					</button>
					{isAuthenticated ? (
						<>
							<NavLink to="/kudos/feed" className={linkClass}>
								Feed
							</NavLink>
							<NavLink to="/kudos/send" className={linkClass}>
								Send Kudos
							</NavLink>
							<NavLink to="/kudos/my-kudos" className={linkClass}>
								My Kudos
							</NavLink>
							<NavLink to="/profile" className={linkClass}>
								Profile
							</NavLink>
							<NavLink to="/dashboard" className={linkClass}>
								Dashboard
							</NavLink>
							{isAdmin ? (
								<NavLink to="/admin" className={linkClass}>
									Admin
								</NavLink>
							) : null}
							<span className="hidden rounded-full border border-slate-700 px-3 py-1 text-slate-300 sm:inline-flex">
								{user?.name}
							</span>
							<button
								type="button"
								onClick={handleLogout}
								className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<NavLink to="/kudos/feed" className={linkClass}>
								Feed
							</NavLink>
							<NavLink to="/login" className={linkClass}>
								Login
							</NavLink>
							<NavLink
								to="/register"
								className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
							>
								Register
							</NavLink>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}
