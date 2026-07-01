const prisma = require('../config/db');
const { AppError } = require('../utils/helpers');

const kudosSelect = {
	id: true,
	message: true,
	createdAt: true,
	isVisible: true,
	senderId: true,
	receiverId: true,
	sender: {
		select: {
			id: true,
			name: true,
			email: true,
			department: true,
			profileImage: true,
			role: true
		}
	},
	receiver: {
		select: {
			id: true,
			name: true,
			email: true,
			department: true,
			profileImage: true,
			role: true
		}
	}
};

const buildSearchFilter = (search) => {
	if (!search) {
		return {};
	}

	return {
		OR: [
			{ message: { contains: search } },
			{ sender: { name: { contains: search } } },
			{ receiver: { name: { contains: search } } },
			{ sender: { department: { contains: search } } },
			{ receiver: { department: { contains: search } } }
		]
	};
};

const buildPaginationMeta = (page, limit, total) => ({
	page,
	limit,
	total,
	totalPages: Math.max(Math.ceil(total / limit), 1)
});

const fetchKudosList = async ({ where, page, limit }) => {
	const skip = (page - 1) * limit;
	const [total, kudos] = await prisma.$transaction([
		prisma.kudos.count({ where }),
		prisma.kudos.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip,
			take: limit,
			select: kudosSelect
		})
	]);

	return {
		kudos,
		meta: buildPaginationMeta(page, limit, total)
	};
};

const createKudos = async (senderId, input) => {
	const sender = await prisma.user.findUnique({
		where: { id: senderId },
		select: { id: true, name: true, email: true, department: true, profileImage: true, role: true }
	});

	if (!sender) {
		throw new AppError('Sender not found', 404);
	}

	if (senderId === input.receiverId) {
		throw new AppError('You cannot send kudos to yourself', 422);
	}

	const receiver = await prisma.user.findUnique({
		where: { id: input.receiverId },
		select: { id: true, name: true, email: true, department: true, profileImage: true, role: true }
	});

	if (!receiver) {
		throw new AppError('Receiver not found', 404);
	}

	const message = input.message.trim();
	if (!message) {
		throw new AppError('Message is required', 422);
	}

	if (message.length > 500) {
		throw new AppError('Message cannot exceed 500 characters', 422);
	}

	const createdKudos = await prisma.$transaction(async (transaction) => {
		const kudos = await transaction.kudos.create({
			data: {
				senderId,
				receiverId: input.receiverId,
				message,
				isVisible: true
			}
		});

		await transaction.notification.create({
			data: {
				userId: receiver.id,
				message: `${sender.name} sent you kudos`
			}
		});

		return kudos;
	});

	return prisma.kudos.findUnique({
		where: { id: createdKudos.id },
		select: kudosSelect
	});
};

const listPublicFeed = async ({ page, limit, search }) => {
	return fetchKudosList({
		where: {
			isVisible: true,
			...buildSearchFilter(search)
		},
		page,
		limit
	});
};

const listSentKudos = async (userId, { page, limit, search }) => {
	return fetchKudosList({
		where: {
			senderId: userId,
			...buildSearchFilter(search)
		},
		page,
		limit
	});
};

const listReceivedKudos = async (userId, { page, limit, search }) => {
	return fetchKudosList({
		where: {
			receiverId: userId,
			...buildSearchFilter(search)
		},
		page,
		limit
	});
};

module.exports = {
	createKudos,
	listPublicFeed,
	listSentKudos,
	listReceivedKudos
};