const path = require('path');
const fs = require('fs');

require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const envFilePath = path.resolve(__dirname, `.env.${NODE_ENV}`);

if (fs.existsSync(envFilePath)) {
  require('dotenv').config({ path: envFilePath });
}

module.exports = {
  NODE_ENV,
  PORT: process.env.PORT || 5000,
  // FIXED: Replaced '@' in the password with '%40'
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://database_admin:MahadevMakta%404753@mahadevmatka.wvjr16t.mongodb.net/?appName=MahadevMatka',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  API_VERSION: process.env.API_VERSION || 'v1',
};