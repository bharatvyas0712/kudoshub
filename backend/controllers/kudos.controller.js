const kudosService = require('../services/kudos.service');
const { sendSuccess } = require('../utils/response');
const { asyncHandler } = require('../utils/helpers');
const { validateCreateKudosPayload, validateKudosQuery } = require('../validators/kudos.validator');

const submitKudos = asyncHandler(async (req, res) => {
	const payload = validateCreateKudosPayload(req.body);
	const kudos = await kudosService.createKudos(req.user.id, payload);

	sendSuccess(res, {
		statusCode: 201,
		message: 'Kudos submitted successfully',
		data: { kudos }
	});
});

const getPublicFeed = asyncHandler(async (req, res) => {
	const query = validateKudosQuery(req.query);
	const result = await kudosService.listPublicFeed(query);

	sendSuccess(res, {
		statusCode: 200,
		message: 'Public feed retrieved',
		data: { kudos: result.kudos },
		meta: result.meta
	});
});

const getSentKudos = asyncHandler(async (req, res) => {
	const query = validateKudosQuery(req.query);
	const result = await kudosService.listSentKudos(req.user.id, query);

	sendSuccess(res, {
		statusCode: 200,
		message: 'Sent kudos retrieved',
		data: { kudos: result.kudos },
		meta: result.meta
	});
});

const getReceivedKudos = asyncHandler(async (req, res) => {
	const query = validateKudosQuery(req.query);
	const result = await kudosService.listReceivedKudos(req.user.id, query);

	sendSuccess(res, {
		statusCode: 200,
		message: 'Received kudos retrieved',
		data: { kudos: result.kudos },
		meta: result.meta
	});
});

module.exports = {
	submitKudos,
	getPublicFeed,
	getSentKudos,
	getReceivedKudos
};