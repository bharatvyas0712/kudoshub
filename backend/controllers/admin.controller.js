const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const getAdminProfile = asyncHandler(async (req, res) => {
	sendSuccess(res, {
		statusCode: 200,
		message: 'Admin profile retrieved',
		data: { user: req.user }
	});
});

module.exports = {
	getAdminProfile
};
