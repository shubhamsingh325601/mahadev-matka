/**
 * Auth Repository
 * Handles authentication-specific database operations
 */

const BaseRepository = require('./baseRepository');
const { User } = require('@models');

class AuthRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user with password field explicitly selected
   * Useful for login (requires { phone: '...' } or { email: '...' })
   */
  async findOneWithPassword(filter) {
    return await this.model.findOne(filter).select('+password');
  }

  /**
   * Check if a phone number already exists
   */
  async phoneExists(phone) {
    return await this.model.exists({ phone });
  }

  /**
   * Find user by ID with Refresh Token explicitly selected
   * (RefreshToken is select: false by default)
   */
  async findByIdWithRefreshToken(id) {
    return await this.model.findById(id).select('+refreshToken');
  }

  /**
   * Update the user's Refresh Token
   */
  async updateRefreshToken(userId, token) {
    return await this.update(userId, {
      refreshToken: token,
    });
  }

  /**
   * Update password reset token
   */
  async setPasswordResetToken(userId, token, expiresIn = 3600000) { // 1 hour
    const expiryDate = new Date(Date.now() + expiresIn);
    return await this.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expiryDate,
    });
  }

  /**
   * Find user by password reset token
   */
  async findByResetToken(token) {
    const user = await this.model.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +password');

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }
    return user;
  }

  /**
   * Update password and clear reset token
   */
  async updatePassword(userId, newPassword) {
    // Retrieve user document to trigger 'pre-save' hooks for hashing
    const user = await this.model.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Clear refresh token on password change for security
    user.refreshToken = undefined;

    return await user.save();
  }

  /**
   * Set email verification token
   */
  async setEmailVerificationToken(userId, token) {
    return await this.update(userId, {
      emailVerificationToken: token,
    });
  }

  /**
   * Verify email
   */
  async verifyEmail(userId) {
    return await this.update(userId, {
      emailVerified: true,
      emailVerificationToken: undefined,
    });
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId) {
    return await this.update(userId, {
      lastLoginAt: new Date(),
    });
  }
}

module.exports = AuthRepository;
