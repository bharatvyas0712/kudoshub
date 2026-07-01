const { AppError, sanitizeString } = require('../utils/helpers');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateRegisterPayload = (payload = {}) => {
	const name = sanitizeString(payload.name, { maxLength: 120 });
	const email = sanitizeString(payload.email, { lowerCase: true, maxLength: 191 });
	const password = payload.password;
	const department = sanitizeString(payload.department, { maxLength: 120 });

	const errors = [];

	if (!requiredString(name)) {
		errors.push('Name is required');
	}

	if (!requiredString(email) || !emailPattern.test(email)) {
		errors.push('A valid email is required');
	}

	if (typeof password !== 'string' || password.length < 8) {
		errors.push('Password must be at least 8 characters long');
	}

	if (!requiredString(department)) {
		errors.push('Department is required');
	}

	if (errors.length > 0) {
		throw new AppError(errors.join(', '), 422);
	}

	return {
		name,
		email,
		password,
		department
	};
};

const validateLoginPayload = (payload = {}) => {
	const email = sanitizeString(payload.email, { lowerCase: true, maxLength: 191 });
	const password = payload.password;

	if (!requiredString(email) || !emailPattern.test(email)) {
		throw new AppError('A valid email is required', 422);
	}

	if (typeof password !== 'string' || password.length < 8) {
		throw new AppError('Password is required', 422);
	}

	return {
		email,
		password
	};
};

module.exports = {
	validateRegisterPayload,
	validateLoginPayload
};
