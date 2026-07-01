const prisma = require('../config/db');
const { AppError, toSafeUser } = require('../utils/helpers');

const safeUserSelect = {
	id: true,
	name: true,
	email: true,
	department: true,
	profileImage: true,
	role: true,
	createdAt: true
};

const buildSearchFilter = ({ search, department }) => {
	const where = {};

	if (search) {
		where.OR = [
			{ name: { contains: search } },
			{ email: { contains: search } },
			{ department: { contains: search } }
		];
	}

	if (department) {
		where.department = department;
	}

	return where;
};

const getCurrentProfile = async (userId) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: safeUserSelect
	});

	if (!user) {
		throw new AppError('User not found', 404);
	}

	return toSafeUser(user);
};

const updateCurrentProfile = async (userId, updates, profileImage) => {
	const existingUser = await prisma.user.findUnique({
		where: { id: userId }
	});

	if (!existingUser) {
		throw new AppError('User not found', 404);
	}

	if (updates.email && updates.email !== existingUser.email) {
		const emailTaken = await prisma.user.findUnique({
			where: { email: updates.email },
			select: { id: true }
		});

		if (emailTaken) {
			throw new AppError('Email is already registered', 409);
		}
	}

	const data = {
		...updates
	};

	if (profileImage) {
		data.profileImage = profileImage;
	}

	const user = await prisma.user.update({
		where: { id: userId },
		data
	});

	return toSafeUser(user);
};

const listEmployees = async (query) => {
	const where = buildSearchFilter(query);
	const page = query.page;
	const limit = query.limit;
	const skip = (page - 1) * limit;

	const [total, users] = await prisma.$transaction([
		prisma.user.count({ where }),
		prisma.user.findMany({
			where,
			orderBy: { [query.sortBy]: query.sortOrder },
			skip,
			take: limit
			,
			select: safeUserSelect
		})
	]);

	return {
		users: users.map(toSafeUser),
		meta: {
			page,
			limit,
			total,
			totalPages: Math.max(Math.ceil(total / limit), 1)
		}
	};
};

const listDepartments = async () => {
	const departments = await prisma.department.findMany({
		orderBy: { name: 'asc' }
	});

	return departments;
};

module.exports = {
	getCurrentProfile,
	updateCurrentProfile,
	listEmployees,
	listDepartments
};