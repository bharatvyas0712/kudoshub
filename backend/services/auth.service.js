const bcrypt = require('bcrypt');

const prisma = require('../config/db');
const { signToken } = require('../utils/jwt');
const { AppError, toSafeUser } = require('../utils/helpers');

const SALT_ROUNDS = 12;

const safeUserSelect = {
	id: true,
	name: true,
	email: true,
	department: true,
	profileImage: true,
	role: true,
	createdAt: true
};

const createAuthResponse = (user) => ({
	token: signToken({ sub: user.id, role: user.role, email: user.email }),
	user: toSafeUser(user)
});

const register = async (input) => {
	const existingUser = await prisma.user.findUnique({
		where: {
			email: input.email
		},
		select: { id: true }
	});

	if (existingUser) {
		throw new AppError('Email is already registered', 409);
	}

	const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
	const user = await prisma.user.create({
		data: {
			name: input.name,
			email: input.email,
			password: hashedPassword,
			department: input.department,
			role: 'EMPLOYEE'
		},
		select: safeUserSelect
	});

	return createAuthResponse(user);
};

const login = async (input) => {
	const user = await prisma.user.findUnique({
		where: {
			email: input.email
		},
		select: {
			id: true,
			name: true,
			email: true,
			department: true,
			profileImage: true,
			role: true,
			createdAt: true,
			password: true
		}
	});

	if (!user) {
		throw new AppError('Invalid email or password', 401);
	}

	const passwordMatches = await bcrypt.compare(input.password, user.password);
	if (!passwordMatches) {
		throw new AppError('Invalid email or password', 401);
	}

	return createAuthResponse(user);
};

const getCurrentUser = async (userId) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: safeUserSelect
	});

	if (!user) {
		throw new AppError('User not found', 404);
	}

	return toSafeUser(user);
};

const logout = async () => ({
	message: 'Logged out successfully'
});

module.exports = {
	register,
	login,
	getCurrentUser,
	logout
};
