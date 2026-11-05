exports.register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);

    // Ubah ke plain object lalu hapus password-nya
    let userData = user.toObject ? user.toObject() : { ...user };
    delete userData.password;

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil!',
      data: { user: userData, token }, // <-- Token disertakan di sini
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};