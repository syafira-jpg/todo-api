const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    // Ubah ke plain object (jika Mongoose document) lalu hapus password-nya
    let userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil!',
      data: { user: userData },
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

    // Bersihkan password dari user object saat login juga (untuk keamanan ekstra)
    let userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;

    res.status(200).json({
      status: 'success',
      message: 'Login berhasil!',
      data: { user: userData, token },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};