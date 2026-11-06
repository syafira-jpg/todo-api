const authService = require('../services/auth.service'); // Pastikan service ter-import jika ada

exports.register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);

    let userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil!',
      data: { user: userData, token },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);

    let userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;

    res.status(200).json({
      status: 'success',
      message: 'Login berhasil!',
      data: { user: userData, token },
    });
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};