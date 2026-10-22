const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Anda belum login! Silakan login untuk mendapatkan akses.', 401));
  }

  const decoded = jwt.verify(token, 'rahasia_super_aman_gamelab');
  const userId = decoded.id || decoded._id;

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(new AppError('User pemilik token ini sudah tidak terdaftar.', 401));
  }

  req.user = currentUser;
  next();
});

module.exports = protect;