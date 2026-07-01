const { asyncHandler } = require('../utils/helpers');

const validateBody = (validator) =>
	asyncHandler(async (req, _res, next) => {
		req.validatedBody = validator(req.body);
		next();
	});

module.exports = {
	validateBody
};
