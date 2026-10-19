const mongoose = require('mongoose');
const dns = require('dns');

// Ensure Windows/local network reliably resolves MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_db';
    const isLocal = uri.includes('localhost') || uri.includes('127.0.0.1');

    const options = {
      serverSelectionTimeoutMS: 5000
    };

    if (isLocal) {
      options.family = 4; // Forces IPv4 on Windows/Node to avoid ::1 resolution delay
    }

    const conn = await mongoose.connect(uri, options);
    console.log(`[MongoDB Connected]: ${conn.connection.host || 'localhost'}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
