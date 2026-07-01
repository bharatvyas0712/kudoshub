import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ASSET_BASE_URL } from '../utils/constants';
import { getErrorMessage } from '../utils/helpers';
import { registerSchema } from '../utils/validators';
import { fetchDepartments, fetchEmployeeProfile, updateEmployeeProfile } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { showToast } from '../utils/notifications';

const profileSchema = registerSchema.pick({ name: true, department: true, email: true });

export default function Profile() {
	const { user, syncUser, refreshUser } = useAuth();
	const [serverError, setServerError] = useState('');
	const [serverMessage, setServerMessage] = useState('');
	const [departmentOptions, setDepartmentOptions] = useState([]);
	const [profilePreview, setProfilePreview] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(true);
	const previewObjectUrlRef = useRef('');

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting }
	} = useForm({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: '',
			email: '',
			department: ''
		}
	});

	const loadProfile = async () => {
		setLoading(true);
		try {
			const [profileResponse, departmentsResponse] = await Promise.all([
				fetchEmployeeProfile(),
				fetchDepartments()
			]);

			const profile = profileResponse.data?.data?.user;
			const departments = departmentsResponse.data?.data?.departments || [];

			if (profile) {
				reset({
					name: profile.name || '',
					email: profile.email || '',
					department: profile.department || ''
				});
				setProfilePreview(profile.profileImage ? `${ASSET_BASE_URL}${profile.profileImage}` : '');
			}

			setDepartmentOptions(departments);
		} catch (error) {
			const message = getErrorMessage(error, 'Unable to load profile');
			setServerError(message);
			showToast({ tone: 'error', title: 'Profile loading failed', message });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProfile();
	}, []);

	useEffect(() => () => {
		if (previewObjectUrlRef.current) {
			URL.revokeObjectURL(previewObjectUrlRef.current);
			previewObjectUrlRef.current = '';
		}
	}, []);

	const departmentChoices = useMemo(() => {
		const names = departmentOptions.map((department) => department.name);
		if (user?.department && !names.includes(user.department)) {
			names.unshift(user.department);
		}
		return names;
	}, [departmentOptions, user]);

	const onFileChange = (event) => {
		const file = event.target.files?.[0];
		setSelectedFile(file || null);

		if (previewObjectUrlRef.current) {
			URL.revokeObjectURL(previewObjectUrlRef.current);
			previewObjectUrlRef.current = '';
		}

		if (file) {
			const objectUrl = URL.createObjectURL(file);
			previewObjectUrlRef.current = objectUrl;
			setProfilePreview(objectUrl);
			return;
		}

		setProfilePreview(user?.profileImage ? `${ASSET_BASE_URL}${user.profileImage}` : '');
	};

	const onSubmit = async (values) => {
		setServerError('');
		setServerMessage('');

		try {
			const formData = new FormData();
			formData.append('name', values.name);
			formData.append('email', values.email);
			formData.append('department', values.department);
			if (selectedFile) {
				formData.append('profileImage', selectedFile);
			}

			const response = await updateEmployeeProfile(formData);
			const updatedUser = response.data?.data?.user;

			if (updatedUser) {
				syncUser(updatedUser);
				await refreshUser();
				setServerMessage('Profile updated successfully');
				showToast({ tone: 'success', title: 'Profile saved', message: 'Your changes were applied.' });
			}
		} catch (error) {
			const message = getErrorMessage(error, 'Unable to update profile');
			setServerError(message);
			showToast({ tone: 'error', title: 'Profile update failed', message });
		}
	};

	if (loading) {
		return <Loader fullScreen label="Loading profile..." />;
	}

	return (
		<section className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
			<div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Employee Profile</p>
					<h1 className="mt-3 text-3xl font-bold text-white">Manage your profile</h1>
				</div>

				<div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
					{profilePreview ? (
						<img src={profilePreview} alt={user?.name} className="h-72 w-full object-cover" />
					) : (
						<div className="flex h-72 items-center justify-center bg-gradient-to-br from-cyan-500/10 to-slate-900 text-slate-400">
							No profile image selected
						</div>
					)}
				</div>

				<div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
					<p className="font-semibold text-white">Current Department</p>
					<p className="mt-1">{user?.department || 'Unassigned'}</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20">
				<div className="grid gap-4 md:grid-cols-2">
					<label className="block space-y-2">
						<span className="text-sm font-medium text-slate-300">Name</span>
						<input {...register('name')} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
						{errors.name ? <span className="text-sm text-rose-300">{errors.name.message}</span> : null}
					</label>

					<label className="block space-y-2">
						<span className="text-sm font-medium text-slate-300">Email</span>
						<input {...register('email')} type="email" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400" />
						{errors.email ? <span className="text-sm text-rose-300">{errors.email.message}</span> : null}
					</label>
				</div>

				<label className="block space-y-2">
					<span className="text-sm font-medium text-slate-300">Department</span>
					<select {...register('department')} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400">
						<option value="">Select department</option>
						{departmentChoices.map((department) => (
							<option key={department} value={department}>
								{department}
							</option>
						))}
					</select>
					{errors.department ? <span className="text-sm text-rose-300">{errors.department.message}</span> : null}
				</label>

				<label className="block space-y-2">
					<span className="text-sm font-medium text-slate-300">Profile Image</span>
					<input type="file" accept="image/*" onChange={onFileChange} className="w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950" />
				</label>

				{serverError ? <p className="rounded-2xl bg-rose-500/10 p-3 text-sm text-rose-200">{serverError}</p> : null}
				{serverMessage ? <p className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{serverMessage}</p> : null}

				<button type="submit" disabled={isSubmitting} className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70">
					{isSubmitting ? 'Saving changes...' : 'Save profile'}
				</button>
			</form>
		</section>
	);
}