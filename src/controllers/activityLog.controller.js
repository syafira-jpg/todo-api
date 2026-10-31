const ActivityLog = require('../models/activityLog.model');

// Mengambil semua riwayat activity log milik user yang sedang login
const getActivityLogs = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Ambil log berdasarkan user, diurutkan dari yang terbaru
    const logs = await ActivityLog.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

module.exports = {
  getActivityLogs,
};