const express = require('express');

// Controllers
const {
	createUser,
	getUserById,
	updateUser,
	loginUser,
} = require('../controllers/users.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const {
	createUserValidations,
	loginUserValidations,
	validateResult,
} = require('../middlewares/validators.middleware');

const router = express.Router();

// Post - Create new user
// Patch - Update user profile (email, name)
// Delete - Disable user account

router.post('/login', loginUserValidations, validateResult, loginUser);

router
	.route('/')
	.post(createUserValidations, validateResult, createUser)
	.patch(protectSession, validateResult, updateUser);

// Get - Get user by id
router.get('/:id', getUserById);

module.exports = { userRouter: router };
