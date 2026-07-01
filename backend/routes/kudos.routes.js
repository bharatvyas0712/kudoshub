const express = require('express');

const kudosController = require('../controllers/kudos.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { kudosRateLimit } = require('../middleware/rate-limit.middleware');

const router = express.Router();

router.get('/feed', kudosController.getPublicFeed);
router.post('/', authMiddleware, kudosRateLimit, kudosController.submitKudos);
router.get('/sent', authMiddleware, kudosController.getSentKudos);
router.get('/received', authMiddleware, kudosController.getReceivedKudos);

module.exports = router;
