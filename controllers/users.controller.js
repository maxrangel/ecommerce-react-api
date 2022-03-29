const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { Email } = require('../utils/email');
const { filterObj } = require('../utils/filterObj');

dotenv.config({ path: './config.env' });

exports.loginUser = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// If user exists with given email
	const user = await User.findOne({ where: { email, status: 'available' } });

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return next(new AppError('Credentials are not valid', 404));
	}

	// Generate JWT
	const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	user.password = undefined;

	res.status(200).json({
		status: 'success',
		data: { user, token },
	});
});

exports.getUserById = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const user = await User.findOne({
		attributes: { exclude: ['password'] },
		where: { id },
	});

	if (!user) {
		return next(new AppError('User not found', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			user,
		},
	});
});

exports.createUser = catchAsync(async (req, res, next) => {
	const { firstName, lastName, email, password, phone } = req.body;

	const newUser = await User.create({
		firstName,
		lastName,
		email,
		password,
		phone,
	});

	// Remove password from response
	newUser.password = undefined;

	// Send welcome Email to user
	await new Email(newUser.email).sendWelcome(newUser.name, newUser.email);

	res.status(201).json({
		status: 'success',
		data: { user: newUser },
	});
});

exports.updateUser = catchAsync(async (req, res, next) => {
	const { currentUser } = req;

	const data = filterObj(req.body, 'name', 'email', 'phone');

	await currentUser.update({ ...data });

	res.status(204).json({ status: 'success' });
});
