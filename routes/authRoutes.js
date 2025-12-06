/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const { authController } = require('@controllers');
const { validate } = require('@middleware'); 

// POST register
router.post('/register', validate('auth', 'register'), authController.register);

// POST login
router.post('/login', validate('auth', 'login'), authController.login);

// POST refresh-token
// Body: refreshToken
router.post('/refresh-token', validate('auth', 'refreshToken'), authController.refreshToken);

// POST forgot password
router.post('/forgot-password', validate('auth', 'forgotPassword'), authController.forgotPassword);

// POST reset password
router.post('/reset-password', validate('auth', 'resetPassword'), authController.resetPassword);

// DELETE account
// Headers: Authorization: Bearer <accessToken>
router.delete('/delete-account',  authController.deleteAccount);

module.exports = router;