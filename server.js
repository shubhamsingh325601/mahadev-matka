// Register module aliases
require('module-alias/register');
require('module-alias').addAliases({
  '@config': `${__dirname}/config`,
  '@database': `${__dirname}/database`,
  '@models': `${__dirname}/models`,
  '@services': `${__dirname}/services`,
  '@controllers': `${__dirname}/controllers`,
  '@routes': `${__dirname}/routes`,
  '@middleware': `${__dirname}/middleware`,
  '@utils': `${__dirname}/utils`,
});

const app = require('./app');
const config = require('@config');

// ============================================
// SERVER CREATION & STARTUP
// ============================================

const server = app.listen(config.PORT, () => {
  console.log(`✓ Server running on http://localhost:${config.PORT}`);
  console.log(`✓ Environment: ${config.NODE_ENV}`);
  console.log(`✓ API Version: ${config.API_VERSION}`);
  console.log(`✓ Database: ${config.MONGODB_URI}`);
  console.log(`✓ Log Level: ${config.LOG_LEVEL}`);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
