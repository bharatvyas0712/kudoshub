class AppError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		this.status = statusCode >= 500 ? 'error' : 'fail';
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
	}
}

const asyncHandler = (handler) => (req, res, next) => {
	Promise.resolve(handler(req, res, next)).catch(next);
};

const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const sanitizeString = (value, options = {}) => {
	if (typeof value !== 'string') {
		return '';
	}

	const { lowerCase = false, maxLength } = options;
	let cleaned = value.replace(/<[^>]*>/g, '');
	cleaned = Array.from(cleaned)
		.filter((character) => {
			const code = character.charCodeAt(0);
			return code >= 32 && code !== 127;
		})
		.join('');
	cleaned = collapseWhitespace(cleaned);

	if (lowerCase) {
		cleaned = cleaned.toLowerCase();
	}

	if (typeof maxLength === 'number' && maxLength >= 0) {
		cleaned = cleaned.slice(0, maxLength);
	}

	return cleaned;
};

const sanitizeOptionalString = (value, options = {}) => {
	if (value === undefined || value === null) {
		return '';
	}

	return sanitizeString(String(value), options);
};

const toSafeUser = (user) => {
	if (!user) {
		return null;
	}

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		department: user.department,
		profileImage: user.profileImage,
		role: user.role,
		createdAt: user.createdAt
	};
};

module.exports = {
	AppError,
	asyncHandler,
	sanitizeString,
	sanitizeOptionalString,
	toSafeUser
};
