const prisma = require('../config/db');
const { verifyToken } = require('../utils/jwt');
const { AppError, asyncHandler, toSafeUser } = require('../utils/helpers');

const extractToken = (authorizationHeader) => {
	if (!authorizationHeader) {
		return null;
	}

	const [scheme, token] = authorizationHeader.split(' ');
	if (scheme !== 'Bearer' || !token) {
		return null;
	}

	return token;
};

const authMiddleware = asyncHandler(async (req, _res, next) => {
	const token = extractToken(req.headers.authorization) || req.headers['x-auth-token'];

	if (!token) {
		throw new AppError('Authentication required', 401);
	}

	let decoded;
	try {
		decoded = verifyToken(token);
	} catch {
		throw new AppError('Invalid or expired token', 401);
	}

	const userId = decoded.sub || decoded.userId || decoded.id;
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			id: true,
			name: true,
			email: true,
			department: true,
			profileImage: true,
			role: true,
			createdAt: true
		}
	});

	if (!user) {
		throw new AppError('User no longer exists', 401);
	}

	req.user = toSafeUser(user);
	req.token = token;
	next();
});

module.exports = authMiddleware;
