/**
 * Auth Controller
 * Handles authentication HTTP requests
 */

const { authService } = require('../services'); // Adjust path as needed
// Import the response utility
const { sendSuccess } = require('../utils/response');

/**
 * Register controller
 */
const register = async (req, res, next) => {
  try {
    const { username, phone, password, confirmPassword } = req.body;
    const result = await authService.register({ username, phone, password, confirmPassword });

    // Usage: sendSuccess(res, data, message, statusCode)
    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error); // Passes to errorHandler
  }
};

/**
 * Login controller
 */
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const result = await authService.login(phone, password);
    sendSuccess(res, result, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token Controller
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    sendSuccess(res, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout Controller
 */
const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await authService.logout(userId);
    sendSuccess(res, result, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot password controller
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await authService.forgotPassword(phone);
    sendSuccess(res, result, 'Password reset instructions sent');
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password controller
 */
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    const result = await authService.resetPassword(resetToken, newPassword, confirmPassword);
    sendSuccess(res, result, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Account controller
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await authService.deleteAccount(userId);
    sendSuccess(res, result, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  deleteAccount,
};
