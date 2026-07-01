const { AppError } = require("../utils/helpers");

const buckets = new Map();

const createRateLimiter = ({ windowMs, limit, message }) => {
	return (req, _res, next) => {
		// Disable rate limiting in development
		if (process.env.NODE_ENV === "development") {
			return next();
		}

		const key =
			req.ip ||
			req.headers["x-forwarded-for"] ||
			req.socket.remoteAddress ||
			"anonymous";

		const now = Date.now();

		let bucket = buckets.get(key);

		if (!bucket || now > bucket.resetAt) {
			bucket = {
				count: 0,
				resetAt: now + windowMs,
			};
		}

		bucket.count++;

		buckets.set(key, bucket);

		if (bucket.count > limit) {
			return next(
				new AppError(
					message || "Too many requests, please try again later",
					429
				)
			);
		}

		next();
	};
};

// General API Rate Limit
const apiRateLimit = createRateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1000,
	message: "Too many API requests, please try again later",
});

// Authentication Rate Limit
const authRateLimit = createRateLimiter({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	message: "Too many authentication attempts, please try again later",
});

// Kudos Rate Limit
const kudosRateLimit = createRateLimiter({
	windowMs: 60 * 1000,
	limit: 200,
	message: "Too many kudos actions, please slow down",
});

module.exports = {
	createRateLimiter,
	apiRateLimit,
	authRateLimit,
	kudosRateLimit,
};