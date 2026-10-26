const express = require('express');
const router = express.Router();

// Middleware pengecekan API Key sederhana
const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'mysecretapikey123';

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Invalid or missing API Key in header (x-api-key)'
    });
  }
  next();
};

/**
 * @swagger
 * /api/stats/summary:
 *   get:
 *     summary: Get summary statistics (Protected by API Key)
 *     tags: [Stats]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: API Key untuk akses eksternal
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 *       401:
 *         description: Unauthorized / API Key salah atau tidak ada
 */
router.get('/summary', verifyApiKey, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      totalTodos: 10,
      completedTodos: 5,
      pendingTodos: 5
    }
  });
});

module.exports = router;