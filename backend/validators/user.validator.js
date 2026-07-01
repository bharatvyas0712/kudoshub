const { AppError, sanitizeString } = require('../utils/helpers');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateProfileUpdatePayload = (payload = {}) => {
	const updates = {};
	const errors = [];

	if (payload.name !== undefined) {
		const name = sanitizeString(payload.name, { maxLength: 120 });
		if (name.length < 2) {
			errors.push('Name must be at least 2 characters');
		} else {
			updates.name = name;
		}
	}

	if (payload.department !== undefined) {
		const department = sanitizeString(payload.department, { maxLength: 120 });
		if (department.length < 2) {
			errors.push('Department must be at least 2 characters');
		} else {
			updates.department = department;
		}
	}

	if (payload.email !== undefined) {
		const email = sanitizeString(payload.email, { lowerCase: true, maxLength: 191 });
		if (!emailPattern.test(email)) {
			errors.push('A valid email is required');
		} else {
			updates.email = email;
		}
	}

	if (errors.length > 0) {
		throw new AppError(errors.join(', '), 422);
	}

	return updates;
};

const validateEmployeeQuery = (query = {}) => {
	const page = Number.parseInt(query.page, 10);
	const limit = Number.parseInt(query.limit, 10);
	const sortBy = typeof query.sortBy === 'string' ? query.sortBy.trim() : 'createdAt';
	const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
	const search = sanitizeString(query.search, { maxLength: 120 });
	const department = sanitizeString(query.department, { maxLength: 120 });

	return {
		page: Number.isNaN(page) || page < 1 ? 1 : page,
		limit: Number.isNaN(limit) || limit < 1 || limit > 100 ? 10 : limit,
		sortBy: ['name', 'email', 'department', 'createdAt'].includes(sortBy) ? sortBy : 'createdAt',
		sortOrder,
		search,
		department
	};
};

module.exports = {
	validateProfileUpdatePayload,
	validateEmployeeQuery
};