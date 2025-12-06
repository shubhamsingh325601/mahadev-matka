/**
 * Auth Service
 * Business logic for authentication
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { RepositoryFactory } = require('@database');

const authRepository = RepositoryFactory.getRepository('Auth');

/**
 * Generate Access and Refresh Tokens
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'access-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } // Short life
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } // Long life
  );

  return { accessToken, refreshToken };
};

/**
 * Register new user
 */
const register = async (userData) => {
  const { username, phone, password, confirmPassword } = userData;

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const existingPhone = await authRepository.findOne({ phone }); 
  if (existingPhone) throw new Error('Phone number already registered');

  const existingUsername = await authRepository.findOne({ username });
  if (existingUsername) throw new Error('Username already taken');

  const user = await authRepository.create({
    username,
    phone,
    password,
    status: 'active',
  });

  // Generate both tokens
  const tokens = generateTokens(user._id);

  // Save refresh token to DB
  await authRepository.updateRefreshToken(user._id, tokens.refreshToken);

  return {
    user: {
      id: user._id,
      username: user.username,
      phone: user.phone,
      status: user.status,
    },
    ...tokens, // Returns accessToken and refreshToken
  };
};

/**
 * Login user
 */
const login = async (phone, password) => {
  const user = await authRepository.findOneWithPassword({ phone });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid phone number or password');
  }

  if (user.status === 'banned') throw new Error('User account is banned');

  // Update last login
  await authRepository.updateLastLogin(user._id);

  // Generate tokens
  const tokens = generateTokens(user._id);

  // Save refresh token to DB
  await authRepository.updateRefreshToken(user._id, tokens.refreshToken);

  return {
    user: {
      id: user._id,
      username: user.username,
      phone: user.phone,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
    },
    ...tokens,
  };
};

/**
 * Refresh Token Logic
 * Exchanges a valid Refresh Token for a new Access Token pair
 */
const refreshTokens = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new Error('Refresh token is required');
  }

  // 1. Verify the token signature
  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }

  // 2. Find user (and explicitly select refreshToken field)
  const user = await authRepository.findByIdWithRefreshToken(decoded.id);
  if (!user) throw new Error('User not found');

  // 3. Check if incoming token matches the one in DB (Detect Reuse/Theft)
  if (user.refreshToken !== incomingRefreshToken) {
    // Optional: If tokens don't match, it might be theft. You could invalidate user sessions here.
    throw new Error('Invalid refresh token');
  }

  // 4. Generate NEW tokens (Rotation)
  const tokens = generateTokens(user._id);

  // 5. Update DB with new refresh token
  await authRepository.updateRefreshToken(user._id, tokens.refreshToken);

  return tokens;
};

/**
 * Logout
 */
const logout = async (userId) => {
  // Clear refresh token in DB
  await authRepository.updateRefreshToken(userId, null);
  return { message: 'Logged out successfully' };
};

/**
 * Forgot password (unchanged logic, abbreviated for brevity)
 */
const forgotPassword = async (phone) => {
  const user = await authRepository.findOne({ phone });
  if (!user) return { message: 'If phone exists, reset instructions will be sent' };
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  await authRepository.setPasswordResetToken(user._id, hashedToken);
  return { message: 'Password reset token generated', resetToken, userId: user._id };
};

/**
 * Reset password (unchanged logic)
 */
const resetPassword = async (resetToken, newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) throw new Error('Passwords do not match');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const user = await authRepository.findByResetToken(hashedToken);
  const updatedUser = await authRepository.updatePassword(user._id, newPassword);
  // Optional: Revoke refresh tokens on password change for security
  await authRepository.updateRefreshToken(user._id, null); 
  return { message: 'Password updated successfully. Please login again.' };
};

/**
 * Delete Account
 */
const deleteAccount = async (userId) => {
  const user = await authRepository.findById(userId);
  if (!user) throw new Error('User not found');
  await authRepository.deleteById(userId);
  return { message: 'Account deleted successfully' };
};

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
  forgotPassword,
  resetPassword,
  deleteAccount,
};