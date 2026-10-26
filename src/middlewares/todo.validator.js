const { body, validationResult } = require('express-validator');

// Middleware untuk mengecek hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Menggunakan standar JSend (status: 'fail')
    return res.status(400).json({
      status: 'fail',
      message: 'Validasi gagal',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

const createTodoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Judul todo wajib diisi!')
    .isString()
    .withMessage('Judul todo harus berupa teks!')
    .trim(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Status completed harus berupa boolean (true/false)'),
  validate,
];

const updateTodoValidation = [
  body('title')
    .optional()
    .isString()
    .withMessage('Judul todo harus berupa teks!')
    .trim(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Status completed harus berupa boolean (true/false)'),
  validate,
];

module.exports = {
  createTodoValidation,
  updateTodoValidation,
};