/**
 * Centralized Response Handler
 * All API responses should use this utility
 */

const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (res, error, message = 'Error', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error: error instanceof Error ? error.message : error,
    timestamp: new Date().toISOString(),
  });
};

const sendPaginated = (res, data, pagination, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
};
