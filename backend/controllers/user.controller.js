const userService = require('../services/user.service');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { validateProfileUpdatePayload, validateEmployeeQuery } = require('../validators/user.validator');

const getEmployeeProfile = asyncHandler(async (req, res) => {
	const user = await userService.getCurrentProfile(req.user.id);
	sendSuccess(res, {
		statusCode: 200,
		message: 'Employee profile retrieved',
		data: { user }
	});
});

const updateEmployeeProfile = asyncHandler(async (req, res) => {
	const updates = validateProfileUpdatePayload(req.body);
	const profileImage = req.file ? `/uploads/profile/${req.file.filename}` : undefined;
	const user = await userService.updateCurrentProfile(req.user.id, updates, profileImage);

	sendSuccess(res, {
		statusCode: 200,
		message: 'Employee profile updated',
		data: { user }
	});
});

const getEmployeeDirectory = asyncHandler(async (req, res) => {
	const query = validateEmployeeQuery(req.query);
	const result = await userService.listEmployees(query);

	sendSuccess(res, {
		statusCode: 200,
		message: 'Employee directory retrieved',
		data: { users: result.users },
		meta: result.meta
	});
});

const getDepartments = asyncHandler(async (req, res) => {
	const departments = await userService.listDepartments();
	sendSuccess(res, {
		statusCode: 200,
		message: 'Departments retrieved',
		data: { departments }
	});
});

module.exports = {
	getEmployeeProfile,
	updateEmployeeProfile,
	getEmployeeDirectory,
	getDepartments
};
