const config = require('@config');

/**
 * Request Logging Middleware
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = `[${req.method}] ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`;

    if (config.LOG_LEVEL === 'debug') {
      console.log(`📝 ${logMessage}`);
    } else if (res.statusCode >= 400) {
      console.error(`❌ ${logMessage}`);
    }
  });

  next();
};

module.exports = requestLogger;
