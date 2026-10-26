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

// Endpoint Statistik yang dilindungi API Key
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