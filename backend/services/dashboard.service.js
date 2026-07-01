const prisma = require('../config/db');

const getLastSevenDays = () => {
	const days = [];
	for (let index = 6; index >= 0; index -= 1) {
		const date = new Date();
		date.setDate(date.getDate() - index);
		const key = date.toISOString().slice(0, 10);
		days.push({ key, label: date.toLocaleDateString('en', { weekday: 'short' }), value: 0 });
	}
	return days;
};

const getDashboardOverview = async (userId) => {
	const [totalEmployees, totalDepartments, totalKudos, unreadNotifications, departmentBreakdown, recentKudos] = await prisma.$transaction([
		prisma.user.count(),
		prisma.department.count(),
		prisma.kudos.count(),
		prisma.notification.count({ where: { userId, isRead: false } }),
		prisma.user.groupBy({
			by: ['department'],
			where: {
				AND: [{ department: { not: null } }, { department: { not: '' } }]
			},
			_count: {
				department: true
			},
			orderBy: {
				_count: {
					department: 'desc'
				}
			},
			take: 5
		}),
		prisma.kudos.findMany({
			take: 50,
			orderBy: {
				createdAt: 'desc'
			},
			select: {
				createdAt: true
			}
		})
	]);

	const activity = getLastSevenDays();
	for (const kudos of recentKudos) {
		const dayKey = kudos.createdAt.toISOString().slice(0, 10);
		const entry = activity.find((item) => item.key === dayKey);
		if (entry) {
			entry.value += 1;
		}
	}

	return {
		metrics: {
			totalEmployees,
			totalDepartments,
			totalKudos,
			unreadNotifications
		},
		charts: {
			departmentBreakdown: departmentBreakdown.map((item) => ({
				label: item.department || 'Unassigned',
				value: item._count.department
			})),
			activity
		}
	};
};

module.exports = {
	getDashboardOverview
};