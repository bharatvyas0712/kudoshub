import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import EmployeeDropdown from './EmployeeDropdown';
import Spinner from './Spinner';
import { kudosSchema } from '../utils/validators';

export default function KudosForm({ employees, currentUserId, onSubmit, onSuccess, onError, loading = false, successMessage = '', errorMessage = '' }) {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors, isSubmitting }
	} = useForm({
		resolver: zodResolver(kudosSchema),
		defaultValues: {
			receiverId: '',
			message: ''
		}
	});

	useEffect(() => {
		setValue('receiverId', '');
		setValue('message', '');
	}, [employees, setValue]);

	const submit = async (values) => {
		try {
			const result = await onSubmit(values);
			reset({ receiverId: '', message: '' });
			onSuccess?.(result);
		} catch (error) {
			onError?.(error);
		}
	};

	const message = watch('message');

	return (
		<form onSubmit={handleSubmit(submit)} className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
			<div>
				<p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Send Kudos</p>
				<h2 className="mt-2 text-2xl font-bold text-white">Write appreciation</h2>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-slate-300">Employee</label>
				<EmployeeDropdown employees={employees} currentUserId={currentUserId} value={watch('receiverId')} onChange={(value) => setValue('receiverId', value, { shouldValidate: true })} placeholder={loading ? 'Loading employees...' : 'Choose a coworker'} />
				{errors.receiverId ? <p className="text-sm text-rose-300">{errors.receiverId.message}</p> : null}
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-slate-300">Message</label>
				<textarea
					{...register('message')}
					rows={7}
					maxLength={500}
					placeholder="Describe what they did well and why it mattered..."
					className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
				/>
				<div className="flex items-center justify-between text-xs text-slate-500">
					<span>{errors.message ? errors.message.message : 'Max 500 characters'}</span>
					<span>{message?.length || 0}/500</span>
				</div>
			</div>

			{successMessage ? <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{successMessage}</p> : null}
			{errorMessage ? <p className="rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{errorMessage}</p> : null}

			<button
				type="submit"
				disabled={loading || isSubmitting}
				className="w-full rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
			>
				<span className="inline-flex items-center gap-2">
					{loading || isSubmitting ? <Spinner size="sm" className="border-slate-950" /> : null}
					{loading || isSubmitting ? 'Submitting...' : 'Submit Kudos'}
				</span>
			</button>
		</form>
	);
}