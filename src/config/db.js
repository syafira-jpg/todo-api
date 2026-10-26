const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mendukung MONGODB_URI atau MONGO_URI, plus fallback ke string lokal/hardcode
    const DB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://syafirakhanzah_db_user:020709@gamelab-mongodb.ebhcyyu.mongodb.net/db_gamelab_indonesia?appName=gamelab-mongodb';

    const conn = await mongoose.connect(DB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;