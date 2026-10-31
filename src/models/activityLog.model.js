const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE_TODO', 'UPDATE_TODO', 'DELETE_TODO', 'CREATE', 'UPDATE', 'DELETE'],
  },
  snapshot: {
    type: mongoose.Schema.Types.Mixed, // Memungkinkan menyimpan objek data todo secara utuh (flexible)
    required: false,
  },
  description: {
    type: String,
    required: false, // Dibuat opsional karena kita menggunakan snapshot
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);