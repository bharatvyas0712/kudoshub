const { AppError, sanitizeString } = require('../utils/helpers');

const normalizeText = (value, options = {}) => sanitizeString(value, options);

const validateCreateKudosPayload = (payload = {}) => {
	const receiverId = normalizeText(payload.receiverId, { maxLength: 191 });
	const message = normalizeText(payload.message, { maxLength: 500 });
	const errors = [];

	if (!receiverId) {
		errors.push('Receiver is required');
	}

	if (!message) {
		errors.push('Message is required');
	}

	if (message.length > 500) {
		errors.push('Message cannot exceed 500 characters');
	}

	if (errors.length > 0) {
		throw new AppError(errors.join(', '), 422);
	}

	return {
		receiverId,
		message
	};
};

const validateKudosQuery = (query = {}) => {
	const page = Number.parseInt(query.page, 10);
	const limit = Number.parseInt(query.limit, 10);
	const search = normalizeText(query.search, { maxLength: 120 });

	return {
		page: Number.isNaN(page) || page < 1 ? 1 : page,
		limit: Number.isNaN(limit) || limit < 1 || limit > 100 ? 8 : limit,
		search
	};
};

module.exports = {
	validateCreateKudosPayload,
	validateKudosQuery
};