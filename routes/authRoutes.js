/**
 * Auth Routes
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 */

const express = require('express');
const router = express.Router();
const { authController } = require('@controllers');
const { validate } = require('@middleware');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's chosen username.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmation of the user's password.
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *             example:
 *               username: johndoe
 *               email: john.doe@example.com
 *               password: password123
 *               confirmPassword: password123
 *               phone: "1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., validation errors, email already exists)
 *       500:
 *         description: Internal server error
 */
// POST register
router.post('/register', validate('auth', 'register'), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 description: The user's phone number.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *             example:
 *               phone: "1234567890"
 *               password: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *                       description: JWT authentication token.
 *       401:
 *         description: Unauthorized (e.g., invalid credentials)
 *       500:
 *         description: Internal server error
 */
// POST login
router.post('/login', validate('auth', 'login'), authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token for obtaining a new access token.
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: New JWT access token.
 *       401:
 *         description: Unauthorized (e.g., invalid refresh token)
 *       500:
 *         description: Internal server error
 */
// POST refresh-token
// Body: refreshToken
router.post('/refresh-token', validate('auth', 'refreshToken'), authController.refreshToken);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 format: "1234567890"
 *                 description: The user's phone for password reset.
 *             example:
 *               phone: "1234567890"
 *     responses:
 *       200:
 *         description: Password reset link sent to email (if user provided the email)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     resetToken:
 *                       type: string
 *                       description: (Development only) The reset token.
 *                     userId:
 *                       type: string
 *                       description: (Development only) The user ID.
 *       500:
 *         description: Internal server error
 */
// POST forgot password
router.post('/forgot-password', validate('auth', 'forgotPassword'), authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: The token received for password reset.
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user.
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user.
 *             example:
 *               resetToken: someverylongresettokensentbyemail
 *               newPassword: newstrongpassword123
 *               confirmPassword: newstrongpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: New JWT authentication token.
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., invalid or expired token)
 *       500:
 *         description: Internal server error
 */
// POST reset password
router.post('/reset-password', validate('auth', 'resetPassword'), authController.resetPassword);

/**
 * @swagger
 * /auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (e.g., missing or invalid token)
 *       500:
 *         description: Internal server error
 */
// DELETE account
// Headers: Authorization: Bearer <accessToken>
router.delete('/delete-account', authController.deleteAccount);

module.exports = router;
