const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const dashboardService = require('../services/dashboard.service');

const getDashboardOverview = asyncHandler(async (req, res) => {
	const overview = await dashboardService.getDashboardOverview(req.user.id);
	sendSuccess(res, {
		statusCode: 200,
		message: 'Dashboard overview retrieved',
		data: {
			user: req.user,
			role: req.user.role,
			permissions: req.user.role === 'ADMIN' ? ['admin'] : ['employee'],
			overview
		}
	});
});

module.exports = {
	getDashboardOverview
};
