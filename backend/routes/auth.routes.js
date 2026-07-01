const express = require('express');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authRateLimit } = require('../middleware/rate-limit.middleware');
const { validateBody } = require('../middleware/validation.middleware');
const {
	validateRegisterPayload,
	validateLoginPayload
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', authRateLimit, validateBody(validateRegisterPayload), authController.register);
router.post('/login', authRateLimit, validateBody(validateLoginPayload), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
