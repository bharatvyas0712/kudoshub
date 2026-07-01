const express = require('express');

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../config/multer');

const router = express.Router();

router.get('/me', authMiddleware, userController.getEmployeeProfile);
router.patch('/me', authMiddleware, upload.single('profileImage'), userController.updateEmployeeProfile);
router.get('/', authMiddleware, userController.getEmployeeDirectory);
router.get('/departments', authMiddleware, userController.getDepartments);

module.exports = router;
