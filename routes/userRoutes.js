const express = require('express');
const router = express.Router();
const { userController } = require('@controllers');
const { validate } = require('@middleware');

/**
 * User Routes
 * Base URL: /api/v1/users
 */

// GET all users
router.get('/', userController.getAllUsers);

// GET user by ID
router.get('/:id', userController.getUserById);

// POST create new user
router.post('/', validate('user', 'create'), userController.createUser);

// PUT update user
router.put('/:id', validate('user', 'update'), userController.updateUser);

// DELETE user
router.delete('/:id', userController.deleteUser);

module.exports = router;
