const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const DB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb+srv://syafirakhanzah_db_user:020709@gamelab-mongodb.ebhcyyu.mongodb.net/db_gamelab_indonesia?appName=gamelab-mongodb';
    
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(DB_URI, opts).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;