const { AppError } = require('../utils/helpers');

const notFound = (req, _res, next) => {
	next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (error, _req, res, _next) => {
	const statusCode = error.statusCode || 500;
	const message = statusCode >= 500 ? 'Internal server error' : error.message || 'Request failed';
	const payload = {
		success: false,
		message
	};

	if (process.env.NODE_ENV !== 'production') {
		console.error(error);
		payload.stack = error.stack;
	}

	res.status(statusCode).json(payload);
};

module.exports = {
	notFound,
	errorHandler
};
