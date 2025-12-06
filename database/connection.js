const mongoose = require('mongoose');
const config = require('@config');

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    // Retry connection after 5 seconds
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection error:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
