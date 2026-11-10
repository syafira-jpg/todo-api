const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLog.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     summary: Get all activity logs for the logged-in user
 *     tags: [ActivityLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ActivityLog'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, activityLogController.getActivityLogs);

module.exports = router;