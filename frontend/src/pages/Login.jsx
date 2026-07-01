import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginSchema } from '../utils/validators';
import { getErrorMessage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, isAuthenticated, user } = useAuth();
	const [serverError, setServerError] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	useEffect(() => {
		if (isAuthenticated && user) {
			navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
		}
	}, [isAuthenticated, navigate, user]);

	const onSubmit = async (values) => {
		setServerError('');

		try {
			const sessionUser = await login(values);
			const destination = location.state?.from?.pathname || (sessionUser.role === 'ADMIN' ? '/admin' : '/dashboard');
			navigate(destination, { replace: true });
		} catch (error) {
			setServerError(getErrorMessage(error, 'Unable to login'));
		}
	};

	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center px-6 py-10">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-md space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/20"
			>
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Login</p>
					<h1 className="mt-2 text-3xl font-bold text-white">Welcome back</h1>
				</div>

				{serverError ? <p className="rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{serverError}</p> : null}

				<label className="block space-y-2">
					<span className="text-sm font-medium text-slate-300">Email</span>
					<input
						{...register('email')}
						type="email"
						className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
					/>
					{errors.email ? <span className="text-sm text-rose-300">{errors.email.message}</span> : null}
				</label>

				<label className="block space-y-2">
					<span className="text-sm font-medium text-slate-300">Password</span>
					<input
						{...register('password')}
						type="password"
						className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
					/>
					{errors.password ? <span className="text-sm text-rose-300">{errors.password.message}</span> : null}
				</label>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
				>
					<span className="inline-flex items-center gap-2">
						{isSubmitting ? <Spinner size="sm" className="border-slate-950" /> : null}
						{isSubmitting ? 'Signing in...' : 'Sign in'}
					</span>
				</button>

				<p className="text-center text-sm text-slate-400">
					Need an account?{' '}
					<Link to="/register" className="font-semibold text-cyan-300">
						Register
					</Link>
				</p>
			</form>
		</div>
	);
}
