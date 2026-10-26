const ActivityLog = require('../models/activityLog.model');

const getActivityLogs = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const logs = await ActivityLog.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'fail', 
      message: 'Gagal mengambil data activity log: ' + error.message 
    });
  }
};

module.exports = {
  getActivityLogs,
};