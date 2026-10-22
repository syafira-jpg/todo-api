const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLog.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, activityLogController.getActivityLogs);

module.exports = router;