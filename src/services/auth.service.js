const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

const register = async (userData) => {
  // Mendukung 'username' dari Swagger maupun 'name' jika ada
  const username = userData.username || userData.name;
  const { email, password } = userData;

  if (!username) {
    throw new AppError('Username wajib diisi!', 400);
  }

  // Cek apakah user sudah terdaftar
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email sudah terdaftar! Silakan gunakan email lain.', 400);
  }

  // Buat user baru
  const user = await User.create({ username, email, password });

  return user;
};

const login = async ({ email, password }) => {
  // 1. Cek kelengkapan input
  if (!email || !password) {
    throw new AppError('Email dan password wajib diisi!', 400);
  }

  // 2. Cek apakah user ada di database
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Email atau password salah!', 401);
  }

  // 3. Buat token JWT dengan secret key konsisten
  const token = jwt.sign(
    { id: user._id },
    'rahasia_super_aman_gamelab',
    { expiresIn: '1d' }
  );

  // Sembunyikan password dari output response
  user.password = undefined;

  return { user, token };
};

module.exports = {
  register,
  login,
};