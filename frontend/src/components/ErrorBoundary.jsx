import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error) {
		console.error('React error boundary caught an error', error);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null });
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
					<div className="max-w-lg rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center shadow-2xl shadow-rose-950/20">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-300">Application error</p>
						<h1 className="mt-4 text-3xl font-bold text-white">Something broke</h1>
						<p className="mt-3 text-slate-300">The interface hit an unexpected error. You can reload the page or return home.</p>
						{this.state.error ? <p className="mt-4 rounded-2xl bg-slate-950/60 p-3 text-left text-xs text-slate-400">{this.state.error.message}</p> : null}
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							<button type="button" onClick={this.handleRetry} className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
								Reload
							</button>
							<Link to="/" className="rounded-full border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-200">
								Go home
							</Link>
						</div>
					</div>
				</main>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;