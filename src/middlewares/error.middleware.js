const AppError = require('../utils/appError');

// Logger sederhana
const logger = (req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
};

// Route tidak ditemukan (404)
const notFound = (req, res, next) => {
  next(new AppError(`Halaman / Route ${req.originalUrl} tidak ditemukan!`, 404));
};

// Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
  console.error('\n==================== ERROR DETAIL ====================');
  console.error(err);
  console.error('======================================================\n');

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = {
  logger,
  notFound,
  globalErrorHandler,
};