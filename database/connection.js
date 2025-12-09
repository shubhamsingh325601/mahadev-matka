const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://database_admin:MahadevMakta%404753@mahadevmatka.wvjr16t.mongodb.net/MahadevMatka',
      {
        serverSelectionTimeoutMS: 5000,  // Max wait.
        socketTimeoutMS: 45000,
        maxPoolSize: 10,                 // Faster performance.
      }
    );

    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;

  } catch (error) {
    console.error('✗ MongoDB error:', error.message);

    // setTimeout(connectDB, 5000); // Retry after 5 sec
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

module.exports = { connectDB, disconnectDB };
