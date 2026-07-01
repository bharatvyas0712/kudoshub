const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');

const register = asyncHandler(async (req, res) => {
	const auth = await authService.register(req.validatedBody);
	sendSuccess(res, {
		statusCode: 201,
		message: 'Registration successful',
		data: auth
	});
});

const login = asyncHandler(async (req, res) => {
	const auth = await authService.login(req.validatedBody);
	sendSuccess(res, {
		statusCode: 200,
		message: 'Login successful',
		data: auth
	});
});

const logout = asyncHandler(async (req, res) => {
	const result = await authService.logout();
	sendSuccess(res, {
		statusCode: 200,
		message: result.message
	});
});

const me = asyncHandler(async (req, res) => {
	const user = await authService.getCurrentUser(req.user.id);
	sendSuccess(res, {
		statusCode: 200,
		message: 'Current user retrieved',
		data: { user }
	});
});

module.exports = {
	register,
	login,
	logout,
	me
};
