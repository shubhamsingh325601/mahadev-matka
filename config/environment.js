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
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/betting',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  API_VERSION: process.env.API_VERSION || 'v1',
};
